import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { inIframe } from '@/lib/utils'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  const isTopLevel =
    location.pathname === '/' || location.pathname === '/llms'
  const currentTab = location.pathname === '/llms' ? 'llms' : 'projects'

  // Sync route changes to parent frame URL for shareable Dataiku links
  useEffect(() => {
    if (inIframe()) {
      try {
        const parentHref = window.parent.location.href
        const baseMatch = parentHref.match(
          /(\/webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*)/
        )
        if (baseMatch) {
          window.parent.history.replaceState(
            null,
            '',
            baseMatch[1] + location.pathname + location.search
          )
        }
      } catch {
        // Can't access parent frame - ignore
      }
    }
  }, [location])

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="mx-auto max-w-5xl">
        {isTopLevel && (
          <Tabs
            value={currentTab}
            onValueChange={(v) => navigate(v === 'llms' ? '/llms' : '/')}
            className="mb-6"
          >
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="llms">LLMs</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        <Outlet />
      </div>
    </div>
  )
}
