// @ts-nocheck

describe('Menu management + entitlements (ROLE_USER)', () => {
  it('opens settings, shows locked item icon, and hides item from sidebar after preference toggle', () => {
    cy.fixture('navbar-role-user-initial.json').then((navbarInitial) => {
      cy.fixture('navbar-role-user-hidden-job-applications.json').then((navbarAfterHide) => {
        cy.fixture('access-role-user.json').then((accessMe) => {
          cy.fixture('entitlements-role-user.json').then((entitlements) => {
            let navbarState = Cypress._.cloneDeep(navbarInitial);

            cy.intercept('GET', '**/api/navbar/my', (req) => {
              req.reply({ statusCode: 200, body: navbarState });
            }).as('getNavbar');

            cy.intercept('GET', '**/api/navbar/prefs', {
              statusCode: 200,
              body: [],
            }).as('getPrefs');

            cy.intercept('POST', '**/api/navbar/prefs/**', (req) => {
              navbarState = Cypress._.cloneDeep(navbarAfterHide);
              req.reply({ statusCode: 200, body: {} });
            }).as('updatePref');

            cy.intercept('GET', '**/api/access/me', {
              statusCode: 200,
              body: accessMe,
            }).as('getAccessMe');

            cy.intercept('GET', '**/api/entitlements/me', {
              statusCode: 200,
              body: entitlements,
            }).as('getEntitlements');

            cy.visit('/user/settings/menu-preferences', {
              onBeforeLoad(win) {
                win.localStorage.setItem('wifence-authenticated', 'true');
                win.localStorage.setItem('wifence-authToken', '"e2e-token"');
                (win as any).__E2E__ = {
                  auth: { authenticated: true, activated: true },
                };
              },
            });

            cy.wait('@getNavbar');
            cy.wait('@getPrefs');

            cy.contains('h2', 'Menu Preferences').should('be.visible');

            cy.contains('.menu-preferences__item-row', 'Job Analytics')
              .find('.menu-preferences__lock-icon')
              .should('exist');

            cy.get('.sidebar-more-apps').click({ force: true });
            cy.get('.sidebar-more-body').should('contain.text', 'Job Applications');

            cy.contains('.menu-preferences__item-row', 'Job Applications')
              .find('button[role="switch"]')
              .click({ force: true });

            cy.wait('@updatePref');
            cy.wait('@getNavbar');

            cy.get('.sidebar-more-apps').click({ force: true });
            cy.get('.sidebar-more-body').should('not.contain.text', 'Job Applications');
          });
        });
      });
    });
  });
});
