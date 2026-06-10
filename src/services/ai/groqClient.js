/**
 * Groq Client — Comunicación con Groq API con multi-model + fallback
 *
 * Capa dedicada y desacoplada para interactuar con Groq.
 * Implementa el contrato definido en provider.js.
 *
 * Multi-model: si un modelo falla (rate-limit 429, timeout, etc.),
 * automáticamente prueba el siguiente en la lista de prioridad.
 *
 * Para cambiar de proveedor en el futuro:
 *   1. Crear nuevo cliente (ej. openaiClient.js)
 *   2. Implementar el mismo contrato { send, name }
 *   3. Cambiar la importación en useAiAssistant.js
 */

import { createProvider } from 'src/services/ai/provider'

const GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Modelos disponibles ordenados por prioridad de uso.
 * Si el primero falla por rate-limit, se prueba el siguiente.
 */
const MODEL_PRIORITY = [
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B' },
  { id: 'gemma2-9b-it', label: 'Gemma 2 9B' },
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
  { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
]

/**
 * @param {ProviderConfig} config
 * @returns {import('./provider').AIProvider}
 */
export function groqProvider(config) {
  const { apiKey, temperature = 0.7, maxTokens = 1024 } = config

  if (!apiKey) {
    console.warn('[GroqClient] No API key configurada. Usando modo simulado.')
    return createProvider(config, {
      name: () => 'Modo simulado',
      send: async (messages) => ({
        content: simulateResponse(messages),
        model: 'Simulado',
        modelId: 'simulated',
      }),
    })
  }

  /**
   * Intenta enviar con un modelo, si falla con 429 prueba el siguiente
   */
  async function tryModel(messages, modelIndex) {
    if (modelIndex >= MODEL_PRIORITY.length) {
      throw new Error('Todos los modelos de Groq fallaron')
    }

    const model = MODEL_PRIORITY[modelIndex]

    try {
      const response = await fetch(GROQ_API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model.id,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
      })

      // Rate limit → probar siguiente modelo
      if (response.status === 429) {
        console.warn(`[GroqClient] Rate limit en ${model.label}, probando siguiente modelo...`)
        return tryModel(messages, modelIndex + 1)
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '')
        // Error de API key o auth → no tiene sentido probar otro modelo
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Error de autenticación Groq (${response.status}). Revisá la API key.`)
        }
        // Otros errores del servidor → probar siguiente modelo
        if (response.status >= 500 && modelIndex < MODEL_PRIORITY.length - 1) {
          console.warn(
            `[GroqClient] Error ${response.status} en ${model.label}, probando siguiente...`,
          )
          return tryModel(messages, modelIndex + 1)
        }
        throw new Error(
          `Groq API error ${response.status}: ${response.statusText}${errorBody ? ` — ${errorBody.slice(0, 200)}` : ''}`,
        )
      }

      const data = await response.json()
      return {
        content: data.choices?.[0]?.message?.content ?? '',
        model: model.label,
        modelId: model.id,
      }
    } catch (err) {
      // Error de red — probar siguiente modelo
      if (
        err.name === 'TypeError' &&
        (err.message.includes('fetch') || err.message.includes('network')) &&
        modelIndex < MODEL_PRIORITY.length - 1
      ) {
        console.warn(`[GroqClient] Error de red en ${model.label}, probando siguiente...`)
        return tryModel(messages, modelIndex + 1)
      }
      throw err
    }
  }

  return createProvider(config, {
    name: () => 'Groq',
    send: (messages) => tryModel(messages, 0),
  })
}

/**
 * Respuesta simulada cuando no hay API key (para desarrollo/demo)
 */
function simulateResponse(messages) {
  const last = messages[messages.length - 1]
  const question = last?.content?.toLowerCase() ?? ''

  if (question.includes('vue') || question.includes('quasar')) {
    return (
      'Isaac tiene experiencia con **Vue.js** y **Quasar Framework**.\n\n' +
      'Desarrolló su proyecto de tesis universitaria (un e-commerce) usando Vue 3, ' +
      'Quasar, Pinia para estado, y Axios para peticiones HTTP.\n\n' +
      'Además, este portfolio está construido con **Vue 3 + Quasar + Tailwind CSS**.'
    )
  }

  if (
    question.includes('node') ||
    question.includes('postgresql') ||
    question.includes('backend')
  ) {
    return (
      'Isaac tiene experiencia sólida en backend con **Node.js**, **Supabase**, **PostgreSQL**, ' +
      '**JWT Authentication**, **RPC Functions** y **Edge Functions**.\n\n' +
      'Diseñó e implementó la arquitectura backend completa de **TuPincha** usando Supabase, ' +
      'integrando autenticación, RLS (Row Level Security), RPC y Edge Functions.'
    )
  }

  if (question.includes('proyecto') || question.includes('complejo')) {
    return (
      'Su proyecto más complejo es **TuPincha**, una plataforma móvil que conecta clientes ' +
      'con proveedores locales. Incluye:\n\n' +
      '- Descubrimiento geolocalizado con Google Maps\n' +
      '- Autenticación con Google Sign-In y Supabase Auth\n' +
      '- Sistema de mensajería interna\n' +
      '- Notificaciones push\n' +
      '- Arquitectura backend completa en Supabase con RLS, RPC y Edge Functions\n\n' +
      'Actualmente también desarrolló la landing page oficial con **React + Tailwind**.'
    )
  }

  if (
    question.includes('contratar') ||
    question.includes('perfil') ||
    question.includes('resume')
  ) {
    return (
      '**Isaac D. Gonzalez Rodriguez** — Ingeniero en Ciencias Informáticas (UCI, 2025)\n\n' +
      'Con **3+ años de experiencia** en desarrollo full-stack, domina:\n\n' +
      '- **Frontend**: Vue.js, React, React Native, Quasar, TypeScript, Tailwind\n' +
      '- **Backend**: Node.js, Supabase, PostgreSQL\n' +
      '- **Móvil**: React Native, Expo\n\n' +
      'Ha liderado TuPincha (app móvil + landing), desarrolló un e-commerce como tesis, ' +
      'y participó en Global Game Jams. Enfoque en arquitectura limpia, ' +
      'desarrollo asistido por IA y diseño centrado en el usuario.'
    )
  }

  return (
    '**Isaac D. Gonzalez Rodriguez** es un Ingeniero en Ciencias Informáticas ' +
    '(UCI, 2025) con experiencia en desarrollo full-stack.\n\n' +
    '**Tecnologías principales:** Vue.js, Quasar, React, React Native, ' +
    'Node.js, TypeScript, Supabase, PostgreSQL\n\n' +
    '**Proyecto destacado:** TuPincha\n\n' +
    'Para más detalles, preguntame específicamente.'
  )
}
