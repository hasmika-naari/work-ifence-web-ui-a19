import { NgModule } from '@angular/core';
import { LucideAngularModule, LucideIconComponent } from 'lucide-angular';

@NgModule({
  imports: [LucideAngularModule.pick(['User', 'Settings', 'Info', 'LogOut', 'LayoutDashboard'])],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}
