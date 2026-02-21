// @ts-nocheck

describe('Menu management + entitlements (ROLE_ADMIN)', () => {
  it('shows Menu Management in settings and disabling an item locks/hides it in sidebar after refresh', () => {
    cy.fixture('navbar-role-admin-initial.json').then((navbarInitial) => {
      cy.fixture('navbar-role-admin-after-disable.json').then((navbarAfterDisable) => {
        cy.fixture('access-role-admin.json').then((accessMe) => {
          cy.fixture('entitlements-role-admin.json').then((entitlements) => {
            let navbarState = Cypress._.cloneDeep(navbarInitial);

            cy.intercept('GET', '**/api/navbar/my', (req) => {
              req.reply({ statusCode: 200, body: navbarState });
            }).as('getNavbar');

            cy.intercept('GET', '**/api/access/me', {
              statusCode: 200,
              body: accessMe,
            }).as('getAccessMe');

            cy.intercept('GET', '**/api/entitlements/me', {
              statusCode: 200,
              body: entitlements,
            }).as('getEntitlements');

            cy.intercept('PUT', '**/api/nav-menu-items/**', (req) => {
              navbarState = Cypress._.cloneDeep(navbarAfterDisable);
              req.reply({ statusCode: 200, body: req.body });
            }).as('saveMenuItem');

            cy.visit('/user/settings', {
              onBeforeLoad(win) {
                win.localStorage.setItem('wifence-authenticated', 'true');
                win.localStorage.setItem('wifence-authToken', '"e2e-token"');
                (win as any).__E2E__ = {
                  auth: { authenticated: true, activated: true },
                };
              },
            });

            cy.wait('@getNavbar');
            cy.contains('a', 'Menu Management').should('be.visible');

            cy.visit('/user/admin/menu-management');
            cy.wait('@getNavbar');

            cy.contains('td', 'Feature Flags').click();
            cy.get('mat-select[formControlName="featureStatus"]').click({ force: true });
            cy.get('mat-option').contains(/^DISABLED$/).click({ force: true });
            cy.contains('button', 'Save').click({ force: true });

            cy.wait('@saveMenuItem');
            cy.wait('@getNavbar');

            cy.get('.sidebar-more-apps').click({ force: true });
            cy.get('.sidebar-more-body').then(($body) => {
              const text = $body.text();
              if (text.includes('Feature Flags')) {
                cy.contains('.sidebar-more-item', 'Feature Flags')
                  .find('.menu-lock-badge')
                  .should('exist');
              } else {
                expect(text).to.not.include('Feature Flags');
              }
            });
          });
        });
      });
    });
  });
});
