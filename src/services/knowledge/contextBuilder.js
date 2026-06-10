/**
 * Context Builder — Analiza preguntas y construye prompts inteligentes
 *
 * Estrategia:
 * 1. Analiza la pregunta del usuario → extrae keywords
 * 2. Busca coincidencias en los JSON de datos
 * 3. Selecciona SOLO la información relevante
 * 4. Construye el prompt con: System Prompt + Contexto + Pregunta
 *
 * Esto reduce tokens y evita problemas de contexto.
 * NO envía todo el contenido de todos los JSON en cada consulta.
 */

import { extractKeywords, searchInObject } from 'src/services/knowledge/knowledgeService'

/**
 * Prompt base del sistema (constante).
 * Define personalidad y reglas del asistente.
 */
const SYSTEM_PROMPT = `
Eres el asistente oficial del portfolio de Isaac González.

Reglas:
1. Responde ÚNICAMENTE utilizando la información proporcionada en el CONTEXTO.
2. NO inventes experiencia profesional, tecnologías, o logros.
3. Si la información no existe en el contexto, indícalo claramente.
4. Mantén un tono profesional pero cercano.
5. Habla sobre Isaac en tercera persona.
6. Responde en el mismo idioma en que te preguntan (español o inglés).
7. Sé conciso — respuestas de 2-4 párrafos máximo.
8. Si preguntan por tecnologías específicas, sé específico con proyectos y ejemplos.
9. Puedes usar **negritas** para resaltar tecnologías o nombres de proyectos.
10. Si la pregunta es un saludo, saluda amablemente y ofrece ayuda.
`.trim()

/**
 * Template del greeting inicial del asistente
 */
export const GREETING_MESSAGE = {
  es: '¡Hola! 👋\n\nSoy el asistente del portfolio de Isaac.\n\nPuedo ayudarte a conocer:\n\n• Experiencia profesional\n• Tecnologías que domina\n• Proyectos destacados\n• Logros técnicos\n• Trayectoria profesional',
  en: "Hello! 👋\n\nI am the assistant for Isaac's portfolio.\n\nI can help you learn about:\n\n• Professional experience\n• Technologies mastered\n• Featured projects\n• Technical achievements\n• Career path",
}

/**
 * Preguntas sugeridas para el usuario
 */
export const SUGGESTED_QUESTIONS = {
  es: [
    '¿Qué experiencia tiene con Vue?',
    '¿Qué tecnologías domina?',
    '¿Cuál es su proyecto más complejo?',
    '¿Tiene experiencia con Node.js?',
    'Resume su perfil profesional',
    '¿Por qué debería contratarlo?',
  ],
  en: [
    'What experience does he have with Vue?',
    'What technologies does he master?',
    'What is his most complex project?',
    'Does he have experience with Node.js?',
    'Summarize his professional profile',
    'Why should I hire him?',
  ],
}

/**
 * Acciones rápidas disponibles
 */
export const QUICK_ACTIONS = {
  es: [
    { id: 'resume', label: '📋 Resumen Profesional', icon: 'description' },
    { id: 'pitch', label: '🎯 Elevator Pitch', icon: 'rocket_launch' },
    { id: 'tech', label: '💻 Tecnologías Principales', icon: 'code' },
    { id: 'projects', label: '🌟 Proyectos Destacados', icon: 'star' },
  ],
  en: [
    { id: 'resume', label: '📋 Professional Summary', icon: 'description' },
    { id: 'pitch', label: '🎯 Elevator Pitch', icon: 'rocket_launch' },
    { id: 'tech', label: '💻 Main Technologies', icon: 'code' },
    { id: 'projects', label: '🌟 Featured Projects', icon: 'star' },
  ],
}

/**
 * Genera el contexto relevante para una pregunta.
 *
 * @param {string} question - pregunta del usuario
 * @param {Object} knowledgeBase - { me, about, xpData }
 * @param {string} locale - 'es' | 'en'
 * @returns {string} contexto formateado para el prompt
 */
export function buildContext(question, knowledgeBase, locale = 'es') {
  const keywords = extractKeywords(question)

  if (keywords.length === 0) {
    return buildDefaultContext(knowledgeBase, locale)
  }

  const contextParts = []
  const foundKeys = new Set()

  for (const keyword of keywords) {
    for (const [source, data] of Object.entries(knowledgeBase)) {
      if (!data) continue
      const results = searchInObject(data, keyword)
      for (const r of results) {
        const key = `${source}:${r.path}:${r.value.slice(0, 60)}`
        if (!foundKeys.has(key)) {
          foundKeys.add(key)
          contextParts.push(`[${source}] ${r.path}: ${r.value}`)
        }
      }
    }
  }

  if (contextParts.length === 0) {
    return buildDefaultContext(knowledgeBase, locale)
  }

  return contextParts.join('\n')
}

/**
 * Contexto por defecto (resumen completo pero conciso).
 */
function buildDefaultContext(knowledgeBase, locale) {
  const parts = []
  const { me, about, xpData } = knowledgeBase

  if (me?.name) {
    parts.push(`Nombre: ${me.name}`)
  }
  if (me?.email) {
    parts.push(`Email: ${me.email}`)
  }

  if (about?.bio?.description) {
    const bio = about.bio.description[locale] ?? about.bio.description.en ?? ''
    parts.push(`Bio: ${bio}`)
  }

  if (about?.skills) {
    const frontend = about.skills.frontend?.join(', ') ?? ''
    const backend = about.skills.backend?.join(', ') ?? ''
    const tools = about.skills.tools?.join(', ') ?? ''
    const ai = about.skills.ai?.join(', ') ?? ''
    parts.push(`Frontend: ${frontend}`)
    parts.push(`Backend: ${backend}`)
    parts.push(`Herramientas: ${tools}`)
    parts.push(`IA: ${ai}`)
  }

  if (about?.education?.institution) {
    const inst = about.education.institution[locale] ?? about.education.institution.en ?? ''
    const degree = about.education.degree[locale] ?? about.education.degree.en ?? ''
    parts.push(`Educación: ${degree} — ${inst} (${about.education.period})`)
  }

  if (xpData?.timeline) {
    const experiences = xpData.timeline.filter((e) => e.type === 'experience')
    for (const exp of experiences) {
      const name = exp.data?.name?.[locale] ?? exp.data?.name?.en ?? ''
      const techs = exp.data?.technologies?.join(', ') ?? ''
      parts.push(`Proyecto: ${name} | Tecnologías: ${techs}`)
    }
  }

  return parts.join('\n')
}

/**
 * Construye el prompt completo para enviar al AI.
 *
 * @param {string} question - pregunta del usuario
 * @param {Object} knowledgeBase
 * @param {string} locale
 * @param {Array} history - historial de mensajes previos [{ role, content }]
 * @returns {Array} array de mensajes para la API de chat
 */
export function buildPrompt(question, knowledgeBase, locale = 'es', history = []) {
  const context = buildContext(question, knowledgeBase, locale)

  const userMessage = `=== CONTEXTO ===\n\n${context}\n\n=== PREGUNTA ===\n\n${question}`

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-6), // últimas 6 interacciones para contexto
    { role: 'user', content: userMessage },
  ]
}

/**
 * Construye un prompt para acciones rápidas.
 *
 * @param {string} actionId - resume|pitch|tech|projects
 * @param {Object} knowledgeBase
 * @param {string} locale
 * @returns {Array} mensajes para la API
 */
export function buildQuickActionPrompt(actionId, knowledgeBase, locale = 'es') {
  const actionQuestions = {
    resume: {
      es: 'Genera un resumen profesional breve del perfil de Isaac, destacando su formación, experiencia principal y tecnologías clave.',
      en: "Generate a brief professional summary of Isaac's profile, highlighting his education, main experience, and key technologies.",
    },
    pitch: {
      es: 'Genera un elevator pitch profesional de aproximadamente 30 segundos sobre Isaac, ideal para una entrevista o presentación rápida.',
      en: 'Generate a professional elevator pitch of about 30 seconds about Isaac, ideal for an interview or quick presentation.',
    },
    tech: {
      es: 'Enumera y describe las tecnologías más relevantes que Isaac domina, organizadas por área (frontend, backend, herramientas, IA).',
      en: 'List and describe the most relevant technologies Isaac masters, organized by area (frontend, backend, tools, AI).',
    },
    projects: {
      es: 'Resume los proyectos más importantes de Isaac, incluyendo tecnologías utilizadas y logros principales.',
      en: "Summarize Isaac's most important projects, including technologies used and key achievements.",
    },
  }

  const question = actionQuestions[actionId]?.[locale] ?? actionQuestions[actionId]?.en ?? ''
  return buildPrompt(question, knowledgeBase, locale, [])
}
