import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import type { DSSProjectSummary, LLMItem } from './api.types'

function getBackendUrl(): string {
  const w = window as unknown as Record<string, unknown>
  const p = window.parent as unknown as Record<string, unknown>
  const getWebappBackendUrlFn = w['getWebAppBackendUrl'] ?? p?.['getWebAppBackendUrl']
  if (typeof getWebappBackendUrlFn === 'function') {
    return (getWebappBackendUrlFn as (s: string) => string)('')
  }
  return '' // relative — works with ng serve proxy and Dataiku
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient)
  private readonly base = getBackendUrl()

  getProjects() {
    return this.http.get<DSSProjectSummary[]>(`${this.base}/api/projects`)
  }

  getLLMs() {
    return this.http.get<LLMItem[]>(`${this.base}/api/llms`)
  }
}
