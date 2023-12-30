// Import required modules and the controller (functions)
const {
  getCustomerById : getCustomerByIdService,
  updateCustomerByAdmin : updateCustomerByAdminService,
} = require('../../services/customersService');

const {
  updateCustomerById,
} = require('../../controllers/customersController');

const bcrypt = require('bcrypt');
const Ajv = require('ajv');
const mockAjv = new Ajv();

// Mocking the services
jest.mock('../../services/customersService');
jest.mock('bcrypt');
jest.mock('ajv');

///////////////// GLOBAL CUSTOMERS ////////////////
describe('Customers Controller', () => {
  ////// UPDATE A CUSTOMER ///////
  describe('updateCustomerById', () => {
    it('should return 204 if customer is updated successfully as admin', async () => {
      // Arrange
      const customerId = 'customerId123';
      const adminRole = 'admin';
      
      const validRequestBody = {
        firstname: 'John',
        lastname: 'Doe',
        mail: 'john.doe@example.com',
        password: 'password123',
        zipCode: 12345,
        address: '123 Main St',
        town: 'City',
      };

      const mockReq = {
        params: { id: customerId },
        body: validRequestBody,
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Spy on the mockAjv.validate method
      const validateSpy = jest.spyOn(mockAjv, 'validate');

      // Mock the behavior of getCustomerByIdService
      getCustomerByIdService.mockResolvedValue({ id: customerId, ...validRequestBody });

      // Mock the behavior of AJV validation
      validateSpy.mockReturnValue(true);

      // Mock the behavior of bcrypt.hash
      bcrypt.hash.mockResolvedValue('hashedPassword123');

      // Mock the behavior of updateCustomerByAdminService
      updateCustomerByAdminService.mockResolvedValue({ id: customerId, ...validRequestBody });

      // Act
      await updateCustomerById(mockReq, mockRes, 'adminId123', adminRole);

      // Assert
      expect(getCustomerByIdService).toHaveBeenCalledWith(customerId);
      expect(validateSpy).toHaveBeenCalledWith(expect.any(Object), validRequestBody);
      expect(bcrypt.hash).toHaveBeenCalledWith(validRequestBody.password, 10);
      expect(updateCustomerByAdminService).toHaveBeenCalledWith(
        customerId,
        validRequestBody.firstname,
        validRequestBody.lastname,
        validRequestBody.mail,
        'hashedPassword123',
        validRequestBody.zipCode,
        validRequestBody.address,
        validRequestBody.town
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();

      // Restore the original method after the test
      validateSpy.mockRestore();
    });
  });
});