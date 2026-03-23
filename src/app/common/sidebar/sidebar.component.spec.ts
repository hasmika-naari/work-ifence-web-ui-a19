import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent onMenuItemClick', () => {
  it('prevents navigation when the item is disabled', () => {
    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as any;

    const component = {
      isMenuItemDisabled: jasmine.createSpy('isMenuItemDisabled').and.returnValue(true),
    } as any;

    SidebarComponent.prototype.onMenuItemClick.call(component, { title: 'Locked', icon: 'lock', locked: true }, event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('does not prevent navigation when the item is enabled', () => {
    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as any;

    const component = {
      isMenuItemDisabled: jasmine.createSpy('isMenuItemDisabled').and.returnValue(false),
      closeMorePanel: jasmine.createSpy('closeMorePanel'),
    } as any;

    SidebarComponent.prototype.onMenuItemClick.call(component, { title: 'Resumes', icon: 'file', route: '/user/resumes' }, event, true);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(event.stopPropagation).not.toHaveBeenCalled();
    expect(component.closeMorePanel).toHaveBeenCalled();
  });
});
