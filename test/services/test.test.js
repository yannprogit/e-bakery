// Import the necessary modules and the service you want to test
const employeeService = require('../../services/employeesService.js');
const db = require('../../models/index.js');

// Mock the database models
jest.mock('../../models/index.js');

describe('Employee Service', () => {
  // Test case for deleteEmployeeById
  describe('deleteEmployeeById', () => {
    it('should not update delivery information if employee role is not 2', async () => {
      // Arrange
      const mockEmployeeId = 1;
      const mockEmployeeWithRole = { id: mockEmployeeId, role: 1 };

      // Set up mock implementation for findOne method in employees
      db.employees.findOne.mockResolvedValue(mockEmployeeWithRole);

      // Act
      const result = await employeeService.deleteEmployeeById(mockEmployeeId);

      // Assert
      // Check if the update method in the buy model was not called
      expect(db.buy.update).not.toHaveBeenCalled();

      // Ensure that the destroy method in employees was called with the expected parameters
      expect(db.employees.destroy).toHaveBeenCalledWith({ where: { id: mockEmployeeId } });

      // Ensure that the result is as expected
      expect(result).toBeUndefined();
    });

    it('should return false when there is a delivery in progress', async () => {
      // Arrange
      const mockEmployeeId = 2;
      const mockEmployeeWithRole = { id: mockEmployeeId, role: 2 };

      // Set up mock implementation for findOne method in employees
      db.employees.findOne.mockResolvedValue(mockEmployeeWithRole);

      // Set up mock implementation for findOne method in the buy model
      db.buy.findOne.mockResolvedValue({ customerId: mockEmployeeId, validation: false, status: 'paid' });

      // Act
      const result = await employeeService.deleteEmployeeById(mockEmployeeId);

      // Assert
      // Check if the update method in the buy model was not called
      expect(db.buy.update).not.toHaveBeenCalled();

      // Ensure that the result is as expected
      expect(result).toBe(false);
    });

    it('should update delivery information and delete employee when role is 2 and no delivery in progress', async () => {
      // Arrange
      const mockEmployeeId = 2;
      const mockEmployeeWithRole = { id: mockEmployeeId, role: 2 };

      // Set up mock implementation for findOne method in employees
      db.employees.findOne.mockResolvedValue(mockEmployeeWithRole);

      // Set up mock implementation for findOne method in the buy model
      db.buy.findOne.mockResolvedValue(null);

      // Set up mock implementation for update method in the buy model
      db.buy.update.mockResolvedValue([1]); // Mocking the update to simulate successful update

      // Set up mock implementation for destroy method in employees
      db.employees.destroy.mockResolvedValue(1);

      // Act
      const result = await employeeService.deleteEmployeeById(mockEmployeeId);

      // Assert
      // Check if the update method in the buy model was called with the expected parameters
      expect(db.buy.update).toHaveBeenCalledWith(
        { deliverymanId: null }, // Values to be updated
        { where: { deliverymanId: mockEmployeeId } } // Condition for updating
      );

      // Check if the destroy method in employees was called with the expected parameters
      expect(db.employees.destroy).toHaveBeenCalledWith({ where: { id: mockEmployeeId } });

      // Ensure that the result is as expected
      expect(result).toBe(true);
    });
  });
});
