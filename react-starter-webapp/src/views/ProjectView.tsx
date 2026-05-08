import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API, type DSSProjectSummary } from '@/Api'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function ProjectView() {
  const { projectKey } = useParams<{ projectKey: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<DSSProjectSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    API.getProjects()
      .then((res) => {
        const found = res.data.find((p) => p.projectKey === projectKey) ?? null
        if (!found) {
          setError(`Project "${projectKey}" not found`)
        } else {
          setProject(found)
        }
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Failed to load project')
      )
      .finally(() => setLoading(false))
  }, [projectKey])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        ← Back to projects
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
          </CardContent>
        </Card>
      ) : project ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{project.name ?? project.projectKey}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Project Key:</span>
              <Badge variant="outline">{project.projectKey}</Badge>
            </div>

            {project.shortDesc && (
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Description:</span>
                <p className="text-sm">{String(project.shortDesc)}</p>
              </div>
            )}

            {project.owner && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Owner:</span>
                <span className="text-sm">{String(project.owner)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
