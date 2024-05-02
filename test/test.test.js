const assert = require('assert');

describe('User', () => {
  let user;

  beforeEach(() => {
    user = {
      firstName: "John",
      lastName: "Doe",
      emailAdress: "john.doe@example.com"
    };
  });

  it('should have a firstName property', () => {
    assert.strictEqual(user.firstName, "John");
  });

  it('should have a lastName property', () => {
    assert.strictEqual(user.lastName, "Doe");
  });

  it('should have an emailAdress property', () => {
    assert.strictEqual(user.emailAdress, "john.doe@example.com");
  });
});