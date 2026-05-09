import { Component, inject, computed } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'
import { catchError, map, of, startWith, switchMap } from 'rxjs'
import { ApiService } from '../../api/api.service'
import type { DSSProjectSummary } from '../../api/api.types'
import { UiAlertComponent, UiAlertTitleComponent, UiAlertDescriptionComponent } from '../../components/ui/alert.component'
import { UiSkeletonComponent } from '../../components/ui/skeleton.component'
import { UiBadgeComponent } from '../../components/ui/badge.component'
import { UiCardComponent, UiCardHeaderComponent, UiCardTitleComponent, UiCardContentComponent } from '../../components/ui/card.component'
import { UiButtonComponent } from '../../components/ui/button.component'

interface ProjectState {
  data: DSSProjectSummary | null
  loading: boolean
  error: string | null
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    UiAlertComponent, UiAlertTitleComponent, UiAlertDescriptionComponent,
    UiSkeletonComponent,
    UiBadgeComponent,
    UiCardComponent, UiCardHeaderComponent, UiCardTitleComponent, UiCardContentComponent,
    UiButtonComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl space-y-6">
      <button ui-button variant="ghost" (click)="goBack()" class="mb-4">
        ← Back to projects
      </button>

      @if (state().error) {
        <ui-alert variant="destructive">
          <ui-alert-title>Error</ui-alert-title>
          <ui-alert-description>{{ state().error }}</ui-alert-description>
        </ui-alert>
      }

      @if (state().loading) {
        <ui-card>
          <ui-card-header><ui-skeleton class="h-8 w-1/2" /></ui-card-header>
          <ui-card-content class="space-y-4">
            <ui-skeleton class="h-4 w-32" />
            <ui-skeleton class="h-4 w-48" />
            <ui-skeleton class="h-4 w-40" />
          </ui-card-content>
        </ui-card>
      }
      @if (project(); as p) {
        <ui-card>
          <ui-card-header>
            <ui-card-title class="text-2xl">{{ p.name || p.projectKey }}</ui-card-title>
          </ui-card-header>
          <ui-card-content class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-muted-foreground">Project Key:</span>
              <ui-badge variant="outline">{{ p.projectKey }}</ui-badge>
            </div>
            @if (p.shortDesc) {
              <div class="space-y-1">
                <span class="text-sm font-medium text-muted-foreground">Description:</span>
                <p class="text-sm">{{ p.shortDesc }}</p>
              </div>
            }
            @if (p.owner) {
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-muted-foreground">Owner:</span>
                <span class="text-sm">{{ p.owner }}</span>
              </div>
            }
          </ui-card-content>
        </ui-card>
      }
    </div>
  `,
})
export class ProjectComponent {
  private api = inject(ApiService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  state = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const key = params.get('projectKey') ?? ''
        return this.api.getProjects().pipe(
          map((projects): ProjectState => {
            const found = projects.find((p) => p.projectKey === key) ?? null
            return found
              ? { data: found, loading: false, error: null }
              : { data: null, loading: false, error: `Project "${key}" not found` }
          }),
          startWith<ProjectState>({ data: null, loading: true, error: null }),
          catchError((e: Error): ProjectState[] => [{ data: null, loading: false, error: e.message ?? 'Failed to load project' }])
        )
      })
    ),
    { initialValue: { data: null, loading: true, error: null } as ProjectState }
  )

  project = computed(() => this.state().data)

  goBack() {
    this.router.navigateByUrl('/')
  }
}
