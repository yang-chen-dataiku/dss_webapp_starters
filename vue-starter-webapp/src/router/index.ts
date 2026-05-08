import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { inIframe } from '@/lib/utils'

// Capture parent URL immediately on script load, before any routing happens
const initialParentPath = inIframe() ? (() => {
  try {
    return window.parent.location.pathname
  } catch {
    return null
  }
})() : null

function getBase(): string {
  const pathName = window.location.pathname

  if (inIframe()) {
    if (pathName.includes('/dip/')) {
      return '/dip/api/webapps/view'
    }
    // Extract base from web-apps-backends path
    // e.g., /web-apps-backends/PROJECT/ID/fetch/bs_init -> /web-apps-backends/PROJECT/ID
    const backendMatch = pathName.match(
      /(\/web-apps-backends\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*)/
    )
    if (backendMatch) {
      return backendMatch[1]
    }
    return pathName.replace(/\/fetch\/.*$/, '') || pathName
  }

  // outside iframe
  let location = pathName.match(
    /(\/public-webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*).*/,
  )
  if (location) {
    return location[1]
  }

  location = pathName.match(
    /(\/webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*).*/,
  )
  return location ? location[1] : ''
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue')
  },
  {
    path: '/projects/:projectKey',
    name: 'project',
    component: () => import('@/views/ProjectView.vue'),
    props: true
  },
  {
    path: '/llms',
    name: 'llms',
    component: () => import('@/views/LLMsView.vue')
  }
]

// Get initial route from parent URL (for shareable links in Dataiku)
function getInitialRoute(): string | null {
  if (initialParentPath) {
    // Extract route after /webapps/PROJECT/ID
    const match = initialParentPath.match(/\/webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*(\/.+)/)
    if (match && match[1] && !match[1].startsWith('/fetch/')) {
      return match[1]
    }
  }
  return null
}

const router = createRouter({
  history: createWebHistory(getBase()),
  routes
})

// On first load, navigate to route from parent URL if present
const initialRoute = getInitialRoute()
let hasNavigatedToInitialRoute = false

// Redirect away from Dataiku's internal routes (but not if we have an initial route to go to)
router.beforeEach((to, _from, next) => {
  if (to.path.startsWith('/fetch/')) {
    if (initialRoute && !hasNavigatedToInitialRoute) {
      hasNavigatedToInitialRoute = true
      next(initialRoute)
    } else {
      next('/')
    }
  } else {
    next()
  }
})

// Sync route changes to parent frame URL (for shareable links in Dataiku)
router.afterEach((to) => {
  if (inIframe()) {
    try {
      const parentHref = window.parent.location.href
      const baseMatch = parentHref.match(/(\/webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*)/)
      if (baseMatch) {
        window.parent.history.replaceState(null, '', baseMatch[1] + to.fullPath)
      }
    } catch {
      // Can't access parent frame - ignore
    }
  }
})

export default router
