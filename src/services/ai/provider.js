/**
 * AI Provider — Interfaz abstracta de proveedor de IA
 *
 * Define el contrato que cualquier provider (Groq, OpenAI, Anthropic, etc.)
 * debe implementar. El resto del sistema solo conoce esta interfaz.
 *
 * Uso:
 *   import { groqProvider } from 'src/services/ai/groqClient'
 *   const provider = groqProvider({ apiKey: '...', model: '...' })
 *   const reply = await provider.send(messages)
 */

/**
 * @typedef {Object} Message
 * @property {'user'|'assistant'|'system'} role
 * @property {string} content
 */

/**
 * @typedef {Object} ProviderConfig
 * @property {string} apiKey
 * @property {string} [model]
 * @property {number} [temperature]
 * @property {number} [maxTokens]
 */

/**
 * @typedef {Object} AIProvider
 * @property {(messages: Message[]) => Promise<string>} send
 *   Envía un array de mensajes y devuelve el texto de respuesta.
 * @property {() => string} name
 *   Nombre legible del provider (ej. "Groq / Llama 3.1 8B")
 */

/**
 * Crea un provider con validación de contrato.
 * Útil para testing o para agregar nuevos providers.
 *
 * @param {ProviderConfig} config
 * @param {object} implementation
 * @param {(messages: Message[], config: ProviderConfig) => Promise<string>} implementation.send
 * @returns {AIProvider}
 */
export function createProvider(config, implementation) {
  if (!implementation || typeof implementation.send !== 'function') {
    throw new Error('[AI Provider] La implementación debe exponer una función send()')
  }

  return {
    send: (messages) => implementation.send(messages, config),
    name: () => implementation.name?.(config) ?? 'Proveedor personalizado',
  }
}
