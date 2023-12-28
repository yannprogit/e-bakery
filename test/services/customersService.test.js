// Import the necessary modules and the service you want to test
const { deleteCustomerById } = require('../../services/customersService.js');
const db = require('../../models/index.js');

// Mock the database models
jest.mock('../../models/index.js');

describe('Customer Service - deleteCustomerById', () => {
    it('should delete a customer by its id', async () => {
  // Mock data for the customer
  const mockCustomer = { id: 1, firstname: 'John', lastname: 'Doe', mail: 'john.doe@example.com', password: 'password', zipCode: '12345', address: '123 Main St', town: 'City' };

  // Mock the behavior of the db.buy.findOne and db.buy.update functions
  db.buy.findOne.mockResolvedValue(null); // No delivery in progress
  db.buy.update.mockResolvedValue([1]); // 1 row affected (updated)
  db.customers.destroy.mockResolvedValue(1); // 1 row affected (deleted)

  // Call the deleteCustomerById method
  const result = await deleteCustomerById(1);

  // Verify that the result is as expected
  expect(result).toBeGreaterThan(0); // Adjust based on your implementation

  // Verify that the necessary functions were called with the correct arguments
  expect(db.buy.destroy).toHaveBeenCalledWith({
    where: {
      customerId: 1,
      status: 'cart',
    },
  });

  expect(db.buy.update).toHaveBeenCalledWith(
    { customerId: null },
    { where: { customerId: 1 } }
  );

  expect(db.customers.destroy).toHaveBeenCalledWith({
    where: { id: 1 },
  });
});

  it('should return false when there is a delivery in progress', async () => {
    // Mock the behavior of the db.buy.findOne function to simulate a delivery in progress
    db.buy.findOne.mockResolvedValue({ customerId: 1, validation: false, status: 'paid' });

    // Call the deleteCustomerById method
    const result = await deleteCustomerById(1);

    // Verify that the result is as expected
    expect(result).toBe(false);

    // Verify that db.customers.destroy was not called in this case
    expect(db.customers.destroy).not.toHaveBeenCalled();
  });
});
