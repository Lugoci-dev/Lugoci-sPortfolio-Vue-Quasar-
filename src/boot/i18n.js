import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

/**
 * Detecta el idioma preferido:
 *  - SSR → header Accept-Language del request HTTP
 *  - Cliente → localStorage (si el usuario eligió manualmente) o navigator.language
 */
function detectLocale(ssrContext) {
  // ── Servidor ──
  if (ssrContext) {
    const acceptLang = ssrContext.req?.headers?.['accept-language']
    if (acceptLang) {
      const lang = acceptLang.split(',')[0]?.split('-')[0]?.trim().toLowerCase()
      if (lang === 'es') return 'es'
    }
    return 'en'
  }

  // ── Cliente ──
  // 1. Prioridad máxima: preferencia guardada por el usuario
  try {
    const saved = localStorage.getItem('locale')
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    /* localStorage no disponible */
  }

  // 2. Detección del navegador
  const navLang = (navigator.language || '').split('-')[0]
  if (navLang === 'es') return 'es'

  return 'en'
}

export default defineBoot(({ app, ssrContext }) => {
  const locale = detectLocale(ssrContext)

  const i18n = createI18n({
    locale,
    fallbackLocale: 'en',
    globalInjection: true,
    messages,
  })

  app.use(i18n)

  // Sincronizar el lenguaje interno de Quasar (UI de componentes)
  // Solo en cliente; si es español, importamos el pack
  if (process.env.CLIENT && locale === 'es') {
    import('quasar/lang/es').then((m) => {
      app.config.globalProperties.$q.lang.set(m.default)
    })
  }
})
