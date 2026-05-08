import { useEffect, useState, useMemo } from 'react'
import { API, type LLMItem } from '@/Api'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function LLMsView() {
  const [llms, setLlms] = useState<LLMItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    API.getLLMs()
      .then((res) => setLlms(res.data))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Failed to load LLMs')
      )
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const list = llms ?? []
    const query = q.trim().toLowerCase()
    if (!query) return list
    return list.filter(
      (l) =>
        (l.id ?? '').toLowerCase().includes(query) ||
        (l.description ?? '').toLowerCase().includes(query) ||
        (l.type ?? '').toLowerCase().includes(query)
    )
  }, [llms, q])

  async function copyId(id: string) {
    await navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">LLMs</h1>
          <p className="text-sm text-muted-foreground mt-1">Available LLMs in DSS</p>
        </div>
        <div className="w-64">
          <Input
            type="search"
            placeholder="Filter by ID"
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          {!filtered.length ? (
            <Alert>
              <AlertTitle>No LLMs</AlertTitle>
              <AlertDescription>No LLMs are configured or match your filter.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
              {filtered.map((l) => (
                <Card key={l.id} className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm text-muted-foreground">
                        {l.description}
                      </CardTitle>
                      <Badge variant="outline" className="shrink-0">
                        {l.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-muted px-2 py-1 rounded text-sm font-mono select-all break-all">
                        {l.id}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyId(l.id)}
                        className="shrink-0"
                      >
                        {copiedId === l.id ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
