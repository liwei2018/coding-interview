describe('PC product detail & cart', () => {
  it('switching SKU updates the price', () => {
    cy.visit('/#/pc/detail?id=1');
    cy.get('[data-test="product-price"]').invoke('text').then((p1) => {
      cy.get('[data-test="sku-size-Large"]').click();
      cy.get('[data-test="product-price"]').invoke('text').should('not.eq', p1);
    });
  });

  it('adds to cart and removes via the remove button', () => {
    cy.visit('/#/pc/detail?id=1');
    cy.get('[data-test="add-to-cart"]').click();
    cy.get('[data-test="ui-toast"]').should('contain', 'Added to cart');
    cy.get('[data-test="cart-link"]').click();
    cy.get('[data-test="cart-row"]').should('have.length', 1);
    cy.on('window:confirm', () => true);
    cy.get('[data-test="remove-btn"]').click();
    cy.get('[data-test="cart-row"]').should('not.exist');
  });

  it('decreasing cart quantity to 0 removes the item', () => {
    cy.visit('/#/pc/detail?id=1');
    cy.get('[data-test="add-to-cart"]').click();
    cy.get('[data-test="cart-link"]').click();
    cy.get('[data-test="cart-row"]').should('have.length', 1);
    cy.get('[data-test="cart-qty"] [data-test="qty-minus"]').click();
    cy.get('[data-test="cart-row"]').should('not.exist');
  });
});
