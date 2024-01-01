const { deleteCustomerById } = require('../../services/customersService.js');
const db = require('../../models/index.js');

jest.mock('../../models/index.js');

describe('Customer Service - deleteCustomerById', () => {
    it('should delete a customer by its id', async () => {

      const mockCustomer = { id: 1, firstname: 'John', lastname: 'Doe', mail: 'john.doe@example.com', password: 'password', zipCode: '12345', address: '123 Main St', town: 'City' };

  db.buy.findOne.mockResolvedValue(null);
  db.buy.update.mockResolvedValue([1]); 
  db.customers.destroy.mockResolvedValue(1); 

  const result = await deleteCustomerById(1);

  expect(result).toBeGreaterThan(0); 

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

    db.buy.findOne.mockResolvedValue({ customerId: 1, validation: false, status: 'paid' });

    const result = await deleteCustomerById(1);

    expect(result).toBe(false);

    expect(db.customers.destroy).not.toHaveBeenCalled();
  });
});
