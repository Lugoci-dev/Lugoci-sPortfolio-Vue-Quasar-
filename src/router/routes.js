const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/HomePage.vue'),
      },
      {
        path: 'about',
        component: () => import('pages/AboutPage.vue'),
      },
      {
        path: 'portfolio',
        component: () => import('pages/PortfolioPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
