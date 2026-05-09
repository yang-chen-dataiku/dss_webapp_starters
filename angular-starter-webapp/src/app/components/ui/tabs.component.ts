import { Component, Input, Output, EventEmitter, inject, HostBinding } from '@angular/core'
import { cn } from '../../lib/utils'

@Component({
  selector: 'ui-tabs',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'flex flex-col gap-2',
    'data-slot': 'tabs',
  },
})
export class UiTabsComponent {
  @Input() value = ''
  @Output() valueChange = new EventEmitter<string>()
}

@Component({
  selector: 'ui-tabs-list',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
    'data-slot': 'tabs-list',
    role: 'tablist',
  },
})
export class UiTabsListComponent {}

@Component({
  selector: 'ui-tabs-trigger',
  standalone: true,
  template: `
    <button
      [class]="cn(
        'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        active ? 'bg-background text-foreground shadow-sm border-input' : 'text-muted-foreground hover:text-foreground'
      )"
      [attr.data-state]="active ? 'active' : 'inactive'"
      data-slot="tabs-trigger"
      role="tab"
      (click)="handleClick()"
    >
      <ng-content />
    </button>
  `,
})
export class UiTabsTriggerComponent {
  private tabs = inject(UiTabsComponent, { optional: true })

  @Input({ required: true }) value!: string

  get active() {
    return this.tabs?.value === this.value
  }

  handleClick() {
    this.tabs?.valueChange.emit(this.value)
  }

  protected cn = cn
}
