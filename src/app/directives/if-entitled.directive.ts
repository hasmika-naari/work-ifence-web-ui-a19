import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject, signal } from '@angular/core';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { isEntitled, type EntitlementKey } from 'src/app/utils/entitlements';

@Directive({
  selector: '[appIfEntitled]',
  standalone: true,
})
export class IfEntitledDirective {
  private readonly tpl = inject(TemplateRef<any>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly accessFacade = inject(AccessFacadeService);

  private readonly key = signal<EntitlementKey | undefined>(undefined);
  private hasView = false;

  @Input('appIfEntitled')
  set appIfEntitled(value: EntitlementKey | undefined) {
    this.key.set(value);
  }

  constructor() {
    effect(() => {
      const key = this.key();
      const me = this.accessFacade.accessMeSignal();
      const allowed = key ? isEntitled(me, key) : true;

      if (allowed && !this.hasView) {
        this.vcr.createEmbeddedView(this.tpl);
        this.hasView = true;
      } else if (!allowed && this.hasView) {
        this.vcr.clear();
        this.hasView = false;
      }
    });
  }
}
