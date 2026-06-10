# Implementación de Asistente IA para Portfolio

## Objetivo

Implementar un asistente conversacional dentro del portfolio que permita responder preguntas relacionadas con mi perfil profesional utilizando exclusivamente la información ya existente en el proyecto.

El asistente debe consumir modelos de IA mediante la API de Groq, utilizando una API Key ya configurada.

El objetivo NO es construir un chatbot generalista, sino un asistente especializado en mi perfil profesional, experiencia, proyectos, tecnologías, logros y trayectoria.

---

# Restricciones Importantes

## Respetar la arquitectura existente

NO crear una nueva arquitectura de carpetas.

NO reorganizar el proyecto.

NO mover archivos existentes.

NO crear módulos artificiales que no sigan la estructura actual.

La implementación debe integrarse utilizando la organización ya existente del portfolio.

---

## Modularidad Obligatoria

Toda la funcionalidad debe estar desacoplada.

Evitar componentes gigantes con múltiples responsabilidades.

Separar claramente:

* UI
* Estado
* Acceso a conocimiento
* Construcción de prompts
* Comunicación con Groq
* Utilidades

Ningún componente visual debe contener lógica compleja de IA.

Ningún componente visual debe construir prompts.

Ningún componente visual debe comunicarse directamente con Groq.

---

# Fuente de Conocimiento

La información utilizada por el asistente ya existe dentro del proyecto.

Debe utilizar los archivos JSON ubicados en:

```text
public/data/
```

Estos archivos representan la fuente oficial de conocimiento.

Ejemplos:

```text
profile.json
experiences.json
projects.json
skills.json
achievements.json
timeline.json
```

No inventar nuevas fuentes de datos.

No utilizar información externa.

No realizar búsquedas en Internet.

No utilizar bases vectoriales.

No utilizar embeddings.

No utilizar RAG avanzado.

---

# Comportamiento Esperado

El asistente debe responder preguntas como:

* ¿Qué experiencia tiene con Vue?
* ¿Qué experiencia tiene con Quasar?
* ¿Ha trabajado con PostgreSQL?
* ¿Cuál es su proyecto más complejo?
* ¿Qué tecnologías domina?
* ¿Qué experiencia tiene con Node.js?
* ¿Por qué debería contratarlo?
* Resume su experiencia profesional.

---

# Estrategia de Contexto

NO enviar todo el contenido de todos los JSON en cada consulta.

Antes de construir el prompt:

1. Analizar la pregunta.
2. Identificar palabras clave relevantes.
3. Buscar coincidencias dentro de los JSON.
4. Seleccionar únicamente la información relacionada.
5. Construir el prompt utilizando únicamente ese subconjunto.

Ejemplo:

Pregunta:

```text
¿Qué experiencia tiene con Vue?
```

Contexto enviado:

* Skills relacionadas con Vue.
* Proyectos que utilizan Vue.
* Experiencias donde aparezca Vue.

NO enviar datos irrelevantes.

El objetivo es reducir el consumo de tokens y evitar problemas de contexto.

---

# Construcción del Prompt

El sistema debe construir prompts dinámicamente.

Prompt base:

```text
Eres el asistente oficial del portfolio de Isaac González.

Reglas:

1. Responde únicamente utilizando la información proporcionada.
2. No inventes experiencia profesional.
3. No inventes tecnologías.
4. Si la información no existe, indícalo claramente.
5. Mantén un tono profesional.
6. Habla sobre Isaac en tercera persona.
```

Contexto:

```text
=== CONTEXTO ===

[Información relevante encontrada]

=== PREGUNTA ===

[PREGUNTA DEL USUARIO]
```

---

# Integración con Groq

La integración debe estar completamente desacoplada.

Toda comunicación con Groq debe realizarse a través de una capa dedicada.

La aplicación debe permitir cambiar fácilmente el proveedor de IA en el futuro.

Ejemplo:

```text
Groq
↓
OpenAI
↓
Anthropic
↓
Gemini
↓
DeepSeek
```

El resto del sistema no debe verse afectado.

---

# Experiencia de Usuario

Mostrar un mensaje inicial explicando qué puede hacer el asistente.

Ejemplo:

```text
Hola 👋

Soy el asistente del portfolio de Isaac.

Puedo ayudarte a conocer:

• Experiencia profesional
• Tecnologías dominadas
• Proyectos destacados
• Logros técnicos
• Trayectoria profesional
```

---

# Preguntas Sugeridas

Incluir preguntas rápidas reutilizables.

Ejemplos:

* ¿Qué experiencia tiene con Vue?
* ¿Qué tecnologías domina?
* ¿Cuál es su proyecto más complejo?
* ¿Tiene experiencia con Node.js?
* Resume su perfil profesional.
* ¿Por qué debería contratarlo?

---

# Funcionalidades Deseables

Además del chat libre, añadir acciones rápidas:

## Resumen Profesional

Generar un resumen breve del perfil.

## Elevator Pitch

Generar una presentación profesional de aproximadamente 30 segundos.

## Tecnologías Principales

Mostrar las tecnologías más relevantes basándose en la información almacenada.

## Proyectos Destacados

Resumir automáticamente los proyectos más importantes.

---

# Objetivos Técnicos

La implementación debe ser:

* Reutilizable
* Escalable
* Desacoplada
* Fácil de mantener
* Fácil de extender
* Compatible con futuras integraciones IA

Evitar acoplamientos innecesarios.

Evitar lógica duplicada.

Priorizar componentes reutilizables y servicios especializados.

La solución debe sentirse como una característica nativa del portfolio y no como un añadido improvisado.
