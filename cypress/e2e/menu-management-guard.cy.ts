// @ts-nocheck

describe('Entitlement guard checks', () => {
  it('redirects locked route access to upgrade or dashboard', () => {
    cy.fixture('navbar-role-user-initial.json').then((navbarInitial) => {
      cy.fixture('access-role-user.json').then((accessMe) => {
        cy.fixture('entitlements-role-user.json').then((entitlements) => {
          cy.intercept('GET', '**/api/navbar/my', {
            statusCode: 200,
            body: navbarInitial,
          }).as('getNavbar');

          cy.intercept('GET', '**/api/access/me', {
            statusCode: 200,
            body: accessMe,
          }).as('getAccessMe');

          cy.intercept('GET', '**/api/entitlements/me', {
            statusCode: 200,
            body: entitlements,
          }).as('getEntitlements');

          cy.visit('/user/job-analytics', {
            onBeforeLoad(win) {
              win.localStorage.setItem('wifence-authenticated', 'true');
              win.localStorage.setItem('wifence-authToken', '"e2e-token"');
              (win as any).__E2E__ = {
                auth: { authenticated: true, activated: true },
              };
            },
          });

          cy.wait('@getNavbar');

          cy.location('pathname', { timeout: 10000 }).should((path) => {
            expect(['/user/billing/upgrade', '/user/dashboard']).to.include(path);
          });
        });
      });
    });
  });
});
