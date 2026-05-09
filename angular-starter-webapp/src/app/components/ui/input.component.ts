import { Component, Input, HostBinding } from '@angular/core'
import { cn } from '../../lib/utils'

@Component({
  selector: 'input[ui-input]',
  standalone: true,
  template: ``,
  host: { 'data-slot': 'input' },
})
export class UiInputComponent {
  @Input({ alias: 'class' }) extraClass = ''

  @HostBinding('class')
  get hostClass() {
    return cn(
      'file:text-foreground placeholder:text-muted-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      this.extraClass
    )
  }
}
