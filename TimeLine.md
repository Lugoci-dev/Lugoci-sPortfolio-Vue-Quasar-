# Dynamic Timeline Architecture - Portfolio Page

## Goal

Build a fully dynamic timeline component for the Portfolio page.

This timeline must NOT be implemented as a traditional list grouped by year.

Instead, it must behave as a temporal positioning engine capable of rendering any type of timeline item (experience, achievement, certification, award, etc.) according to its date information.

---

# Core Principles

## Timeline owns positioning

The timeline component is the only element responsible for:

* Determining date ranges
* Calculating positions
* Handling overlaps
* Creating timeline markers
* Rendering year and month references

Items must never calculate their own position.

---

## Timeline items are render-only

Timeline items receive data and render content.

Examples:

* ExperienceCard
* AchievementCard
* AwardCard
* CertificationCard

The timeline does not know how those components are rendered internally.

It only knows where they should appear.

---

# Data Source

The component receives:

```ts
timeline: TimelineEntry[]
```

Example:

```json
{
  "timeline": []
}
```

---

# Supported Types

Current:

* experience
* achievement

Future:

* award
* certification
* game_jam
* publication
* milestone

The architecture must allow new types without modifying the timeline engine.

---

# Date Model

Experiences use ranges:

```json
{
  "cycle": {
    "start": {},
    "end": {}
  }
}
```

Achievements use a single date:

```json
{
  "cycle": {
    "date": {}
  }
}
```

The timeline engine must normalize both models internally.

---

# Temporal Calculation

Convert all dates into absolute month indexes.

Example:

2024 January = 0

2024 February = 1

...

2025 January = 12

...

Position formula:

position =
(itemMonthIndex - firstMonthIndex)
/
(lastMonthIndex - firstMonthIndex)

Result:

0.0 → beginning

1.0 → end

---

# Dynamic Range

The timeline must automatically determine:

* earliest date
* latest date

No hardcoded years are allowed.

The visual range must grow or shrink according to the provided dataset.

---

# Year Markers

Years must always be visible.

Example:

2026

2025

2024

These markers serve as permanent navigation references.

---

# Month Markers

Months should remain hidden by default.

They become visible only when:

* hovering a year section
* expanding a year
* activating detailed mode

The interface should prioritize clarity over density.

---

# Layout

The timeline is vertical.

Years are displayed in descending order.

Newest year at the top.

Oldest year at the bottom.

Example:

2026

2025

2024

---

# Item Placement

The timeline determines where each item belongs.

Items are injected through slots or dynamic components.

Example:

```vue
<TimelineNode :entry="entry">
  <component :is="resolveComponent(entry.type)" />
</TimelineNode>
```

The timeline never contains business-specific UI.

---

# Dynamic Height

Timeline height must never be calculated from years.

Timeline height must depend on content density.

More items = more height.

Fewer items = less height.

Avoid large empty vertical areas.

---

# Collision Handling

If multiple items belong to the same month:

* stack them
* offset them
* create lanes

Never allow cards to overlap visually.

---

# Responsiveness

Desktop:

* full timeline
* visible year markers

Tablet:

* reduced spacing

Mobile:

* simplified timeline
* compact cards
* maintain chronological order

---

# Forbidden Implementations

Do NOT:

* hardcode years
* hardcode months
* hardcode positions
* group cards manually by year
* use CSS hacks for placement
* rely on fixed heights

All positions must be calculated from the dataset.

---
---
DATA ZONE... 

Te propongo este modelo: Es mejor que la timeline consuma una única colección ordenable.

```json
{
  "timeline": []
}
```

Cada elemento tiene:

```json
{
  "id": "",
  "type": "",
  "cycle": {},
  "data": {}
}
```

---

# Formato Experience

Mantiene prácticamente todo lo que ya tienes.

```json
{
  "id": "tupincha-mobile",

  "type": "experience",

  "cycle": {
    "start": {
      "year": 2025,
      "month_key": "december",
      "label": {
        "es": "Diciembre",
        "en": "December"
      }
    },

    "end": {
      "year": 2026,
      "month_key": "june",
      "label": {
        "es": "Junio",
        "en": "June"
      }
    }
  },

  "data": {
    "name": {
      "es": "TuPincha (App móvil nueva versión) - Lead Developer",
      "en": "TuPincha (Mobile App new version) - Lead Developer"
    },

    "summary": {
      "es": "Resumen...",
      "en": "Summary..."
    },

    "technologies": [
      "React Native",
      "Expo",
      "Supabase"
    ],

    "tools": [
      "Google Maps"
    ],

    "items": [
      {
        "es": "Descripción",
        "en": "Description"
      }
    ]
  }
}
```

---

# Formato Achievement

Aquí no hay duración.

Es un evento puntual.

```json
{
  "id": "ggj-2025",

  "type": "achievement",

  "cycle": {
    "date": {
      "year": 2025,
      "month_key": "january",
      "label": {
        "es": "Enero",
        "en": "January"
      }
    }
  },

  "data": {
    "title": {
      "es": "Global Game Jam 2025",
      "en": "Global Game Jam 2025"
    },

    "description": {
      "es": "Participación en evento internacional de desarrollo de videojuegos.",
      "en": "Participation in international game development event."
    },

    "icon": "trophy",

    "tags": [
      "Godot",
      "Game Jam",
      "Teamwork"
    ]
  }
}
```

---

# Formato Award

```json
{
  "id": "best-ui-award",

  "type": "award",

  "cycle": {
    "date": {
      "year": 2026,
      "month_key": "march",
      "label": {
        "es": "Marzo",
        "en": "March"
      }
    }
  },

  "data": {
    "title": {
      "es": "Premio Mejor UI",
      "en": "Best UI Award"
    },

    "organization": {
      "es": "Organización",
      "en": "Organization"
    },

    "description": {
      "es": "Descripción",
      "en": "Description"
    }
  }
}
```

---

# Formato Certification

```json
{
  "id": "vue-certification",

  "type": "certification",

  "cycle": {
    "date": {
      "year": 2025,
      "month_key": "august",
      "label": {
        "es": "Agosto",
        "en": "August"
      }
    }
  },

  "data": {
    "title": {
      "es": "Vue 3 Certification",
      "en": "Vue 3 Certification"
    },

    "issuer": {
      "es": "Issuer",
      "en": "Issuer"
    },

    "credential_url": "",
    "credential_id": ""
  }
}
```
