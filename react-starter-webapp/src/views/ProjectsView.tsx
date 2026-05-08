import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { API, type DSSProjectSummary } from '@/Api'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function ProjectsView() {
  const [projects, setProjects] = useState<DSSProjectSummary[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    API.getProjects()
      .then((res) => setProjects(res.data))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Failed to load projects')
      )
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const list = projects ?? []
    const query = q.trim().toLowerCase()
    if (!query) return list
    return list.filter(
      (p) =>
        (p.name ?? '').toLowerCase().includes(query) ||
        (p.projectKey ?? '').toLowerCase().includes(query)
    )
  }, [projects, q])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">DSS Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Click on a project to view details</p>
        </div>
        <div className="w-64">
          <Input
            type="search"
            placeholder="Filter by name or key"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          {!filtered.length ? (
            <Alert>
              <AlertTitle>No projects</AlertTitle>
              <AlertDescription>Try clearing the filter or check your permissions.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {filtered.map((p) => (
                <Link
                  key={p.projectKey}
                  to={`/projects/${p.projectKey}`}
                  className="block group"
                >
                  <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="truncate pr-2">{p.name ?? p.projectKey}</CardTitle>
                      <span className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0">
                        &rarr;
                      </span>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground shrink-0">Key</span>
                      <span className="text-xs font-mono text-muted-foreground truncate">
                        {p.projectKey}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
