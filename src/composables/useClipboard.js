import { ref } from 'vue'

/**
 * useClipboard — Copia texto al portapapeles con feedback de estado
 *
 * @param {number} [resetDelay=2000] — ms antes de resetear `copied`
 * @returns {{ copied: import('vue').Ref<boolean>, copy: (text: string) => Promise<void> }}
 *
 * @example
 * const { copied, copy } = useClipboard()
 * copy('texto a copiar')
 */
export function useClipboard(resetDelay = 2000) {
  const copied = ref(false)
  let timeoutId = null

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
    } catch {
      // Fallback para navegadores sin API clipboard
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      copied.value = true
    }

    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      copied.value = false
      timeoutId = null
    }, resetDelay)
  }

  return { copied, copy }
}
