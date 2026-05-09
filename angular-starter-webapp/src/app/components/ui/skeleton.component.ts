import { Component } from '@angular/core'

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  template: ``,
  host: {
    class: 'block animate-pulse rounded-md bg-primary/10',
    'data-slot': 'skeleton',
  },
})
export class UiSkeletonComponent {}
