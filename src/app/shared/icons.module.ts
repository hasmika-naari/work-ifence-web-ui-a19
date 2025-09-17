// icons.module.ts
import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BookOpen, Briefcase, GraduationCap, Info, LogIn, Bell,
         LayoutGrid, Menu, ChevronDown, User, BookOpenCheck, BookMarked, Award, Facebook, Instagram, MessageCircle } from 'lucide-angular';

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
      Award,
      Facebook,
      Instagram,
      MessageCircle
    })
  ],
  exports: [LucideAngularModule],
})
export class IconsModule {}
