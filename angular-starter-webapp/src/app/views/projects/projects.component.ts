import { Component, inject, signal, computed } from '@angular/core'
import { RouterLink } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'
import { catchError, map, of, startWith } from 'rxjs'
import { ApiService } from '../../api/api.service'
import type { DSSProjectSummary } from '../../api/api.types'
import { UiAlertComponent, UiAlertTitleComponent, UiAlertDescriptionComponent } from '../../components/ui/alert.component'
import { UiSkeletonComponent } from '../../components/ui/skeleton.component'
import { UiCardComponent, UiCardHeaderComponent, UiCardTitleComponent, UiCardContentComponent } from '../../components/ui/card.component'
import { UiInputComponent } from '../../components/ui/input.component'

interface ProjectsState {
  data: DSSProjectSummary[] | null
  loading: boolean
  error: string | null
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    RouterLink,
    UiAlertComponent, UiAlertTitleComponent, UiAlertDescriptionComponent,
    UiSkeletonComponent,
    UiCardComponent, UiCardHeaderComponent, UiCardTitleComponent, UiCardContentComponent,
    UiInputComponent,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">DSS Projects</h1>
          <p class="text-sm text-muted-foreground mt-1">Click on a project to view details</p>
        </div>
        <div class="w-64">
          <input
            ui-input
            type="search"
            placeholder="Filter by name or key"
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
                <ui-skeleton class="h-4 w-40" />
              </ui-card-content>
            </ui-card>
          }
        </div>
      } @else {
        @if (!filtered().length) {
          <ui-alert>
            <ui-alert-title>No projects</ui-alert-title>
            <ui-alert-description>Try clearing the filter or check your permissions.</ui-alert-description>
          </ui-alert>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
            @for (p of filtered(); track p.projectKey) {
              <a [routerLink]="['/projects', p.projectKey]" class="block group">
                <ui-card class="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full overflow-hidden">
                  <ui-card-header class="flex flex-row items-center justify-between space-y-0">
                    <ui-card-title class="truncate pr-2">{{ p.name || p.projectKey }}</ui-card-title>
                    <span class="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0">&rarr;</span>
                  </ui-card-header>
                  <ui-card-content class="flex items-center gap-2">
                    <span class="text-sm text-muted-foreground shrink-0">Key</span>
                    <span class="text-xs font-mono text-muted-foreground truncate">{{ p.projectKey }}</span>
                  </ui-card-content>
                </ui-card>
              </a>
            }
          </div>
        }
      }
    </div>
  `,
})
export class ProjectsComponent {
  private api = inject(ApiService)

  skeletons = [1, 2, 3, 4, 5, 6]
  q = signal('')

  state = toSignal(
    this.api.getProjects().pipe(
      map((data): ProjectsState => ({ data, loading: false, error: null })),
      startWith<ProjectsState>({ data: null, loading: true, error: null }),
      catchError((e: Error): ProjectsState[] => [{ data: null, loading: false, error: e.message ?? 'Failed to load projects' }])
    ),
    { initialValue: { data: null, loading: true, error: null } as ProjectsState }
  )

  filtered = computed(() => {
    const list = this.state().data ?? []
    const query = this.q().trim().toLowerCase()
    if (!query) return list
    return list.filter(
      (p) =>
        (p.name ?? '').toLowerCase().includes(query) ||
        p.projectKey.toLowerCase().includes(query)
    )
  })
}
