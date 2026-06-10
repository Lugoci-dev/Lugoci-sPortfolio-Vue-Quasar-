/**
 * Knowledge Service — Fuente de conocimiento del asistente
 *
 * Carga y provee acceso a los archivos JSON en public/data/.
 * NO inventa datos — solo trabaja con la información existente.
 * NO usa vectores, embeddings, ni RAG.
 *
 * Los JSON reales en el proyecto:
 *   - me.json        → Información personal, redes, email
 *   - about.json     → Bio, expertise, skills, educación
 *   - xp_data.json   → Timeline completa (experiencias, logros, proyectos)
 */

const DATA_FILES = ['me.json', 'about.json', 'xp_data.json']

/**
 * Carga todos los archivos JSON de datos del portfolio.
 * Se llama una vez al inicio y se cachea.
 *
 * @returns {Promise<Object>} { me, about, xpData }
 */
export async function loadKnowledgeBase() {
  const base = import.meta.env.BASE_URL ?? '/'

  async function fetchJson(filename) {
    const res = await fetch(`${base}data/${filename}`)
    if (!res.ok) throw new Error(`Error cargando ${filename}: HTTP ${res.status}`)
    return res.json()
  }

  const [me, about, xpData] = await Promise.all(
    DATA_FILES.map((f) =>
      fetchJson(f).catch((err) => {
        console.warn(`[KnowledgeService] No se pudo cargar ${f}:`, err.message)
        return null
      }),
    ),
  )

  return { me, about, xpData }
}

/**
 * Busca texto en todos los niveles de un objeto (recursivo).
 * Retorna los fragmentos que matchean.
 *
 * @param {Object} obj
 * @param {string} keyword - palabra clave en minúsculas
 * @param {string[]} [path] - ruta actual para contexto
 * @returns {Array<{ path: string, value: string }>}
 */
export function searchInObject(obj, keyword, path = []) {
  const results = []
  if (!obj || typeof obj !== 'object') return results

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...path, key]

    if (typeof value === 'string') {
      if (value.toLowerCase().includes(keyword)) {
        results.push({ path: currentPath.join('.'), value })
      }
    } else if (Array.isArray(value)) {
      // Para arrays, buscar en cada elemento
      for (let i = 0; i < value.length; i++) {
        const item = value[i]
        if (typeof item === 'object' && item !== null) {
          // Buscar en propiedades del objeto
          const nested = searchInObject(item, keyword, [...currentPath, `[${i}]`])
          results.push(...nested)

          // Si tiene name/title, incluir como resultado conciso
          const label = item.name ?? item.title ?? null
          if (label && typeof label === 'object') {
            // Es un objeto i18n { es, en }
            const text = Object.values(label).join(' ')
            if (text.toLowerCase().includes(keyword)) {
              results.push({
                path: currentPath.join('.'),
                value: text,
              })
            }
          } else if (label && typeof label === 'string' && label.toLowerCase().includes(keyword)) {
            results.push({
              path: currentPath.join('.'),
              value: label,
            })
          }
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      const nested = searchInObject(value, keyword, currentPath)
      results.push(...nested)
    }
  }

  return results
}

/**
 * Extrae keywords relevantes de una pregunta.
 *
 * @param {string} question
 * @returns {string[]}
 */
export function extractKeywords(question) {
  if (!question) return []

  const stopWords = [
    'que',
    'qué',
    'como',
    'cómo',
    'cuál',
    'cual',
    'cuáles',
    'cuales',
    'tiene',
    'tengo',
    'tienes',
    'tiene',
    'tienen',
    'tenemos',
    'con',
    'sin',
    'para',
    'por',
    'del',
    'de',
    'la',
    'el',
    'lo',
    'las',
    'los',
    'un',
    'una',
    'y',
    'e',
    'o',
    'a',
    'ante',
    'bajo',
    'what',
    'which',
    'how',
    'does',
    'have',
    'has',
    'had',
    'with',
    'without',
    'for',
    'about',
    'the',
    'a',
    'an',
    'in',
    'on',
    'at',
    'is',
    'are',
    'was',
    'were',
    'do',
    'does',
    'did',
    'can',
    'could',
    'would',
    'should',
    'will',
    'shall',
    'may',
    'might',
    'must',
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
    'me',
    'him',
    'her',
    'us',
    'them',
    'my',
    'your',
    'his',
    'its',
    'our',
    'their',
  ]

  // Normalizar: lowercase, quitar signos
  const cleaned = question
    .toLowerCase()
    .replace(/[¿?¡!.,;:()"'«»-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const words = cleaned.split(' ').filter((w) => w.length > 2 && !stopWords.includes(w))

  // Palabras compuestas: tecnologías multi-palabra
  const techTerms = [
    'vue',
    'vue.js',
    'react',
    'react native',
    'node.js',
    'node',
    'quasar',
    'typescript',
    'javascript',
    'tailwind',
    'supabase',
    'postgresql',
    'frontend',
    'backend',
    'fullstack',
    'full stack',
    'mobile',
    'angular',
    'expo',
    'pinia',
    'vite',
    'stripe',
    'godot',
    'git',
    'firebase',
    'docker',
    'figma',
    'scrum',
    'html5',
    'css3',
    'google maps',
    'jwt',
    'rpc',
    'edge functions',
    'rls',
    'global game jam',
    'tupincha',
    'ecommerce',
    'e-commerce',
  ]

  const foundTechTerms = techTerms.filter((term) => question.toLowerCase().includes(term))

  return [...new Set([...foundTechTerms, ...words])]
}
