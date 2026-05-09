import { Component, Input, HostBinding } from '@angular/core'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-colors overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

@Component({
  selector: 'ui-badge',
  standalone: true,
  template: `<ng-content />`,
  host: { 'data-slot': 'badge' },
})
export class UiBadgeComponent {
  @Input() variant: BadgeVariant = 'default'

  @HostBinding('class')
  get hostClass() {
    return badgeVariants({ variant: this.variant })
  }
}
