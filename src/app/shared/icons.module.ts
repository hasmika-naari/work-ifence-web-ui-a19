// icons.module.ts
import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BookOpen, Briefcase, GraduationCap, Info, LogIn, Bell,
         LayoutGrid, Menu, ChevronDown, User, BookOpenCheck, BookMarked, Award } from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      BookOpen,
      Briefcase,
      GraduationCap,
      Info,
      LogIn,
      Bell,
      User,
      LayoutGrid,
      Menu,
      ChevronDown,
      BookOpenCheck,
      BookMarked,
      Award
    })
  ],
  exports: [LucideAngularModule],
})
export class IconsModule {}
