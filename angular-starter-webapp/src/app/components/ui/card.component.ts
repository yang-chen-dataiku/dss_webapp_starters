import { Component } from '@angular/core'

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
    'data-slot': 'card',
  },
})
export class UiCardComponent {}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'flex flex-col gap-1.5 px-6',
    'data-slot': 'card-header',
  },
})
export class UiCardHeaderComponent {}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'block leading-none font-semibold',
    'data-slot': 'card-title',
  },
})
export class UiCardTitleComponent {}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'block text-muted-foreground text-sm',
    'data-slot': 'card-description',
  },
})
export class UiCardDescriptionComponent {}

@Component({
  selector: 'ui-card-content',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'block px-6',
    'data-slot': 'card-content',
  },
})
export class UiCardContentComponent {}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'flex items-center px-6',
    'data-slot': 'card-footer',
  },
})
export class UiCardFooterComponent {}
