import { createBrowserRouter, Navigate } from 'react-router-dom'
import { inIframe } from '@/lib/utils'
import Layout from '@/components/Layout'
import ProjectsView from '@/views/ProjectsView'
import ProjectView from '@/views/ProjectView'
import LLMsView from '@/views/LLMsView'

// Capture parent URL immediately on script load, before any routing happens
const initialParentPath = inIframe()
  ? (() => {
      try {
        return window.parent.location.pathname
      } catch {
        return null
      }
    })()
  : null

export function getBase(): string {
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

  let location = pathName.match(
    /(\/public-webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*).*/
  )
  if (location) return location[1]

  location = pathName.match(/(\/webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*).*/)
  return location ? location[1] : ''
}

function getInitialRoute(): string | null {
  if (initialParentPath) {
    const match = initialParentPath.match(
      /\/webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*(\/.+)/
    )
    if (match && match[1] && !match[1].startsWith('/fetch/')) {
      return match[1]
    }
  }
  return null
}

const initialRoute = getInitialRoute()

function FetchRedirect() {
  return <Navigate to={initialRoute ?? '/'} replace />
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <ProjectsView /> },
        { path: 'projects/:projectKey', element: <ProjectView /> },
        { path: 'llms', element: <LLMsView /> },
        { path: 'fetch/*', element: <FetchRedirect /> },
      ],
    },
  ],
  { basename: getBase() }
)
