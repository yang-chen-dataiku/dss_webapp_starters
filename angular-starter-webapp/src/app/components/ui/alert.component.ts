import { Component, Input, HostBinding } from '@angular/core'
import { cva, type VariantProps } from 'class-variance-authority'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid grid-cols-[0_1fr] gap-y-0.5 items-start',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive: 'text-destructive bg-card',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

type AlertVariant = VariantProps<typeof alertVariants>['variant']

@Component({
  selector: 'ui-alert',
  standalone: true,
  template: `<ng-content />`,
  host: { 'data-slot': 'alert', role: 'alert' },
})
export class UiAlertComponent {
  @Input() variant: AlertVariant = 'default'

  @HostBinding('class')
  get hostClass() {
    return alertVariants({ variant: this.variant })
  }
}

@Component({
  selector: 'ui-alert-title',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'block col-start-2 line-clamp-1 font-medium tracking-tight',
    'data-slot': 'alert-title',
  },
})
export class UiAlertTitleComponent {}

@Component({
  selector: 'ui-alert-description',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'block text-muted-foreground col-start-2 text-sm',
    'data-slot': 'alert-description',
  },
})
export class UiAlertDescriptionComponent {}
