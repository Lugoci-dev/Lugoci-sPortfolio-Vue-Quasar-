import { defineStore } from 'pinia'
import { apiProducts } from 'src/boot/axios'

export const useProjectsStore = defineStore('project', {
  state: () => ({
    projects: [],
  }),

  getters: {
    relevantProjects: (state) => {
      return state.projects.filter((project) => project.relevant)
    },
  },

  actions: {
    async loadData() {
      try {
        const response = await apiProducts.get('')
        // const data = await response.json()

        console.log(response.data)
        this.projects = response.data
      } catch (error) {
        console.warn(error)
        alert('error')
      }
    },
  },
})
