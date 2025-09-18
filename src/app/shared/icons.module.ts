// icons.module.ts
import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BookOpen, Briefcase, GraduationCap, Info, LogIn, Bell,
         LayoutGrid, Menu, ChevronDown, User, BookOpenCheck, BookMarked,
         Award, Facebook, Instagram, MessageCircle, ArrowRight, LayoutDashboard,
         Linkedin, X, Shield, FileText, HelpCircle, UserPlus, CornerDownRight,
         Settings, LogOut, Undo2, Home } from 'lucide-angular';

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
      MessageCircle,
      ArrowRight,
      LayoutDashboard,
      Linkedin,
      X,
      Shield,
      FileText,
      HelpCircle,
      UserPlus,
      CornerDownRight,
      Settings,
      LogOut,
      Undo2,
      Home
    })
  ],
  exports: [LucideAngularModule],
})
export class IconsModule {}
