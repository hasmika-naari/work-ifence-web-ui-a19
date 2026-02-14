import { SidebarComponent } from './sidebar.component';
import { UpgradeDialogComponent } from 'src/app/resume-portal/components/upgrade-dialog.component';

describe('SidebarComponent locked nav click', () => {
  it('opens upgrade dialog when locked item is clicked', () => {
    const dialog = {
      open: jasmine.createSpy('open'),
    };

    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as any;

    const component = {
      dialog,
      onLockedMenuClick: SidebarComponent.prototype.onLockedMenuClick,
    } as any;

    component.onLockedMenuClick({ locked: true }, event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalledWith(UpgradeDialogComponent, jasmine.any(Object));
  });
});
