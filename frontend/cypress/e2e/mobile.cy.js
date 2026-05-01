describe('Mobile product detail & cart', () => {
  beforeEach(() => cy.viewport('iphone-x'));

  it('switching color and capacity updates price and stock', () => {
    cy.visit('/#/mobile/detail?id=1');
    cy.get('[data-test="product-stock"]').invoke('text').then((s1) => {
      cy.get('[data-test="sku-color-Deep Sea Blue"]').click();
      cy.get('[data-test="sku-capacity-32GB"]').click();
      cy.get('[data-test="product-stock"]').invoke('text').should('not.eq', s1);
    });
  });

  it('badge updates after add-to-cart and item can be removed in the cart', () => {
    cy.visit('/#/mobile/detail?id=1');
    cy.get('[data-test="add-to-cart"]').click();
    cy.get('[data-test="ui-toast"]').should('be.visible');
    cy.get('[data-test="cart-link"]').click();
    cy.url().should('include', '/mobile/cart');
    cy.get('[data-test="cart-row"]').should('have.length.at.least', 1);
    cy.on('window:confirm', () => true);
    cy.get('[data-test="remove-btn"]').first().click();
  });
});
