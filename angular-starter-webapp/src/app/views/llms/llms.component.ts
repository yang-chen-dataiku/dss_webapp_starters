import { Component, inject, signal, computed } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { catchError, map, startWith } from 'rxjs'
import { ApiService } from '../../api/api.service'
import type { LLMItem } from '../../api/api.types'
import { UiAlertComponent, UiAlertTitleComponent, UiAlertDescriptionComponent } from '../../components/ui/alert.component'
import { UiSkeletonComponent } from '../../components/ui/skeleton.component'
import { UiBadgeComponent } from '../../components/ui/badge.component'
import { UiCardComponent, UiCardHeaderComponent, UiCardTitleComponent, UiCardContentComponent } from '../../components/ui/card.component'
import { UiButtonComponent } from '../../components/ui/button.component'
import { UiInputComponent } from '../../components/ui/input.component'

interface LLMsState {
  data: LLMItem[] | null
  loading: boolean
  error: string | null
}

@Component({
  selector: 'app-llms',
  standalone: true,
  imports: [
    UiAlertComponent, UiAlertTitleComponent, UiAlertDescriptionComponent,
    UiSkeletonComponent,
    UiBadgeComponent,
    UiCardComponent, UiCardHeaderComponent, UiCardTitleComponent, UiCardContentComponent,
    UiButtonComponent,
    UiInputComponent,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">LLMs</h1>
          <p class="text-sm text-muted-foreground mt-1">Available LLMs in DSS</p>
        </div>
        <div class="w-64">
          <input
            ui-input
            type="search"
            placeholder="Filter by ID"
            [value]="q()"
            (input)="q.set($any($event.target).value)"
          />
        </div>
      </div>

      @if (state().error) {
        <ui-alert variant="destructive">
          <ui-alert-title>Failed to load</ui-alert-title>
          <ui-alert-description>{{ state().error }}</ui-alert-description>
        </ui-alert>
      }

      @if (state().loading) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (n of skeletons; track n) {
            <ui-card>
              <ui-card-header><ui-skeleton class="h-5 w-3/4" /></ui-card-header>
              <ui-card-content class="space-y-2">
                <ui-skeleton class="h-4 w-24" />
              </ui-card-content>
            </ui-card>
          }
        </div>
      } @else {
        @if (!filtered().length) {
          <ui-alert>
            <ui-alert-title>No LLMs</ui-alert-title>
            <ui-alert-description>No LLMs are configured or match your filter.</ui-alert-description>
          </ui-alert>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
            @for (l of filtered(); track l.id) {
              <ui-card class="h-full">
                <ui-card-header class="pb-2">
                  <div class="flex items-start justify-between gap-2">
                    <ui-card-title class="text-sm text-muted-foreground">{{ l.description }}</ui-card-title>
                    <ui-badge variant="outline" class="shrink-0">{{ l.type }}</ui-badge>
                  </div>
                </ui-card-header>
                <ui-card-content>
                  <div class="flex items-center gap-2">
                    <code class="flex-1 bg-muted px-2 py-1 rounded text-sm font-mono select-all break-all">{{ l.id }}</code>
                    <button
                      ui-button
                      variant="ghost"
                      size="sm"
                      (click)="copyId(l.id)"
                      class="shrink-0"
                    >{{ copiedId() === l.id ? 'Copied!' : 'Copy' }}</button>
                  </div>
                </ui-card-content>
              </ui-card>
            }
          </div>
        }
      }
    </div>
  `,
})
export class LLMsComponent {
  private api = inject(ApiService)

  skeletons = [1, 2, 3, 4, 5, 6]
  q = signal('')
  copiedId = signal<string | null>(null)

  state = toSignal(
    this.api.getLLMs().pipe(
      map((data): LLMsState => ({ data, loading: false, error: null })),
      startWith<LLMsState>({ data: null, loading: true, error: null }),
      catchError((e: Error): LLMsState[] => [{ data: null, loading: false, error: e.message ?? 'Failed to load LLMs' }])
    ),
    { initialValue: { data: null, loading: true, error: null } as LLMsState }
  )

  filtered = computed(() => {
    const list = this.state().data ?? []
    const query = this.q().trim().toLowerCase()
    if (!query) return list
    return list.filter(
      (l) =>
        l.id.toLowerCase().includes(query) ||
        (l.description ?? '').toLowerCase().includes(query) ||
        l.type.toLowerCase().includes(query)
    )
  })

  async copyId(id: string) {
    await navigator.clipboard.writeText(id)
    this.copiedId.set(id)
    setTimeout(() => this.copiedId.set(null), 1500)
  }
}
