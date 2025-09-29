import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('project', {
  state: () => ({
    projects: [
      {
        id: '2ew-wdfFs',
        name: 'Tesis project',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit, facere odit nemo? Magnam, repellendus?',
        relevant: true,
        imageTop: 'src/assets/preview.jpg',
        languages: ['HTML', 'CSS', 'JavaScript', 'Vue'],
        tools: ['vue', 'Quasar', 'Stripe'],
      },
      {
        id: '3ew-ydfFs',
        name: 'Countries Api',
        description:
          'Amet nisi inventore iste quo neque aperiam suscipit minus ducimus esse odio debitis obcaecati eum delectus consequuntur.',
        relevant: true,
        imageTop: 'src/assets/preview 2.jpg',
        languages: ['HTML', 'CSS', 'TypeScript', 'Angular', 'API'],
        tools: ['Angular', 'API'],
      },
      {
        id: '4ew-xdfFs',
        name: 'Jobs listing',
        description:
          'Amet nisi inventore iste quo neque aperiam suscipit minus ducimus esse odio debitis obcaecati eum delectus consequuntur.',
        relevant: true,
        imageTop: 'src/assets/preview 2.jpg',
        languages: ['HTML', 'CSS', 'JavaScript'],
        tools: ['Json'],
      },
    ],
  }),

  getters: {
    relevantProjects: (state) => {
      return state.projects.filter((project) => project.relevant)
    },
  },

  actions: {
    increment() {
      this.counter++
    },
  },
})
