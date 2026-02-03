import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent locked nav click', () => {
  it('redirects locked item to /user/billing/upgrade with feature + returnUrl', () => {
    const router = {
      url: '/current/path',
      navigate: jasmine.createSpy('navigate'),
    };

    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
    } as any;

    const component = {
      router,
      onLockedMenuClick: SidebarComponent.prototype.onLockedMenuClick,
    } as any;

    component.onLockedMenuClick({ entitlementKey: 'feature.x' }, event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/user/billing/upgrade'], {
      queryParams: { feature: 'feature.x', returnUrl: '/current/path' },
    });
  });
});
