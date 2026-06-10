/**
 * Groq Client — Comunicación con Groq API
 *
 * Capa dedicada y desacoplada para interactuar con Groq.
 * Implementa el contrato definido en provider.js.
 *
 * Para cambiar de proveedor en el futuro:
 *   1. Crear nuevo cliente (ej. openaiClient.js)
 *   2. Implementar el mismo contrato { send, name }
 *   3. Cambiar la importación en useAiAssistant.js
 */

import { createProvider } from 'src/services/ai/provider'

const GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * @param {ProviderConfig} config
 * @returns {import('./provider').AIProvider}
 */
export function groqProvider(config) {
  const { apiKey, model = 'llama-3.1-8b-instant', temperature = 0.7, maxTokens = 1024 } = config

  if (!apiKey) {
    console.warn('[GroqClient] No API key configurada. Usando modo simulado.')
  }

  return createProvider(config, {
    name: () => `Groq / ${model}`,

    send: async (messages) => {
      if (!apiKey) {
        return simulateResponse(messages)
      }

      try {
        const response = await fetch(GROQ_API_BASE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
            stream: false,
          }),
        })

        if (!response.ok) {
          const errorBody = await response.text().catch(() => '')
          throw new Error(
            `Groq API error ${response.status}: ${response.statusText}${errorBody ? ` — ${errorBody.slice(0, 200)}` : ''}`,
          )
        }

        const data = await response.json()
        return data.choices?.[0]?.message?.content ?? ''
      } catch (err) {
        console.error('[GroqClient] Error:', err)
        throw err
      }
    },
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
      'Isaac tiene experiencia con Vue.js y Quasar Framework. ' +
      'Desarrolló su proyecto de tesis universitaria (un e-commerce) usando Vue 3, ' +
      'Quasar, Pinia para estado, y Axios para peticiones HTTP. ' +
      'Además, este portfolio está construido con Vue 3 + Quasar + Tailwind CSS.'
    )
  }

  if (
    question.includes('node') ||
    question.includes('postgresql') ||
    question.includes('backend')
  ) {
    return (
      'Isaac tiene experiencia sólida en backend con Node.js, Supabase, PostgreSQL, ' +
      'JWT Authentication, RPC Functions y Edge Functions. ' +
      'Diseñó e implementó la arquitectura backend completa de TuPincha usando Supabase, ' +
      'integrando autenticación, RLS (Row Level Security), RPC y Edge Functions.'
    )
  }

  if (question.includes('proyecto') || question.includes('complejo')) {
    return (
      'Su proyecto más complejo es **TuPincha**, una plataforma móvil que conecta clientes ' +
      'con proveedores locales. Incluye: descubrimiento geolocalizado con Google Maps, ' +
      'autenticación con Google Sign-In y Supabase Auth, sistema de mensajería interna, ' +
      'notificaciones push, y una arquitectura backend completa en Supabase con RLS, RPC y ' +
      'Edge Functions. Actualmente también desarrolló la landing page oficial.'
    )
  }

  if (
    question.includes('contratar') ||
    question.includes('perfil') ||
    question.includes('resume')
  ) {
    return (
      'Isaac es un Ingeniero en Ciencias Informáticas con 3+ años de experiencia en desarrollo ' +
      'full-stack. Domina Vue.js, React, React Native, Node.js, y TypeScript. ' +
      'Ha liderado el desarrollo de TuPincha (app móvil + landing page), desarrolló un e-commerce ' +
      'como tesis universitaria, y ha participado en Global Game Jams. ' +
      'Su enfoque combina arquitectura limpia, desarrollo asistido por IA, y diseño centrado en ' +
      'el usuario. Habla español nativo e inglés B1+.'
    )
  }

  return (
    'Isaac D. Gonzalez Rodriguez es un Ingeniero en Ciencias Informáticas ' +
    '(UCI, 2025) con experiencia en desarrollo full-stack. Tecnologías principales: ' +
    'Vue.js, Quasar, React, React Native, Node.js, TypeScript, Supabase, PostgreSQL. ' +
    'Proyecto destacado: TuPincha. Para más detalles, pregúntame específicamente.'
  )
}
