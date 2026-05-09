import { Component, inject } from '@angular/core'
import { Router, RouterOutlet, NavigationEnd } from '@angular/router'
import { filter } from 'rxjs/operators'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { map } from 'rxjs/operators'
import { CommonModule } from '@angular/common'
import { UiTabsComponent, UiTabsListComponent, UiTabsTriggerComponent } from './components/ui/tabs.component'
import { inIframe } from './lib/utils'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, UiTabsComponent, UiTabsListComponent, UiTabsTriggerComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground p-6">
      <div class="mx-auto max-w-5xl">
        @if (isTopLevel()) {
          <ui-tabs [value]="currentTab()" (valueChange)="navigate($event)" class="mb-6">
            <ui-tabs-list>
              <ui-tabs-trigger value="projects">Projects</ui-tabs-trigger>
              <ui-tabs-trigger value="llms">LLMs</ui-tabs-trigger>
            </ui-tabs-list>
          </ui-tabs>
        }
        <router-outlet />
      </div>
    </div>
  `,
})
export class AppComponent {
  private router = inject(Router)

  private url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  )

  currentTab = () => (this.url().startsWith('/llms') ? 'llms' : 'projects')
  isTopLevel = () => this.url() === '/' || this.url().startsWith('/llms')

  navigate(tab: string) {
    this.router.navigateByUrl(tab === 'llms' ? '/llms' : '/')
  }

  constructor() {
    // Sync route changes to parent frame URL for shareable Dataiku links
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((e) => {
        if (inIframe()) {
          try {
            const parentHref = window.parent.location.href
            const baseMatch = parentHref.match(
              /(\/webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*)/
            )
            if (baseMatch) {
              window.parent.history.replaceState(null, '', baseMatch[1] + e.urlAfterRedirects)
            }
          } catch {
            // Can't access parent frame - ignore
          }
        }
      })
  }
}
