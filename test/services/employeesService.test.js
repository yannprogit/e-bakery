// Import the necessary modules and the service you want to test
const employeeService = require('../../services/employeesService.js');
const buyService = require('../../services/buyService.js');
const db = require('../../models/index.js');


// Mock the database models
jest.mock('../../models/index.js');

describe('Employee Service', () => {
  // Mock data for testing
  const mockEmployees = [
    { id: 1, firstname: 'John', lastname: 'Doe', role: 1 },
    { id: 2, firstname: 'Alice', lastname: 'Smith', role: 2 },
  ];
  const mockRoleId = 1;
  const mockRoleName = 'Manager';

  // Test case for getEmployees
  describe('getEmployees', () => {
    it('should return a list of employees', async () => {
      // Set up mock implementation for findAll method
      db.employees.findAll.mockResolvedValue(mockEmployees);

      // Call the method
      const result = await employeeService.getEmployees();

      // Check the result
      expect(result).toEqual(mockEmployees);
    });
  });

  // Test case for getRole
  describe('getRole', () => {
    it('should return the name of an employee\'s role', async () => {
      // Set up mock implementation for findOne method
      db.roles.findOne.mockResolvedValue({ name: mockRoleName });

      // Call the method
      const result = await employeeService.getRole(mockRoleId);

      // Check the result
      expect(result).toBe(mockRoleName);
    });
  });

  // Test case for getEmployeesByRole
  describe('getEmployeesByRole', () => {
    it('should return a list of employees with a specific role', async () => {
      // Set up mock implementation for findAll method
      db.employees.findAll.mockResolvedValue(mockEmployees);

      // Call the method
      const result = await employeeService.getEmployeesByRole(mockRoleId);

      // Check the result
      expect(result).toEqual(mockEmployees);
    });
  });

  // Test case for getEmployeeById
  describe('getEmployeeById', () => {
    it('should return an employee by their id', async () => {
      const mockEmployeeId = 1;
      const mockEmployee = { id: mockEmployeeId, firstname: 'Jane', lastname: 'Doe', role: 1 };

      // Set up mock implementation for findOne method
      db.employees.findOne.mockResolvedValue(mockEmployee);

      // Call the method
      const result = await employeeService.getEmployeeById(mockEmployeeId);

      // Check the result
      expect(result).toEqual(mockEmployee);
    });
  });

  // Test case for addEmployee
  describe('addEmployee', () => {
    it('should add a new employee', async () => {
      const mockFirstName = 'Bob';
      const mockLastName = 'Johnson';
      const mockMail = 'bob@example.com';
      const mockPassword = 'securepassword';
      const mockRole = 1;

      const mockNewEmployee = {
        id: 3,
        firstname: mockFirstName,
        lastname: mockLastName,
        mail: mockMail,
        password: mockPassword,
        role: mockRole,
      };

      // Set up mock implementation for create method
      db.employees.create.mockResolvedValue(mockNewEmployee);

      // Call the method
      const result = await employeeService.addEmployee(
        mockFirstName,
        mockLastName,
        mockMail,
        mockPassword,
        mockRole
      );

      // Check the result
      expect(result).toEqual(mockNewEmployee);
    });
  });




  // Test case for deleteEmployeeById
  describe('deleteEmployeeById', () => {
    it('should not update delivery information if employee role is not 2', async () => {
        const mockEmployeeId = 1;
        const mockEmployeeWithRole = { id: mockEmployeeId, role: 1 };
    
        db.employees.findOne.mockResolvedValue(mockEmployeeWithRole);
    
        const result = await employeeService.deleteEmployeeById(mockEmployeeId);
    
        // Check if the update method in the buy model was not called
        expect(db.buy.update).not.toHaveBeenCalled();
    
        // Ensure that the destroy method in employees was called with the expected parameters
        expect(db.employees.destroy).toHaveBeenCalledWith({ where: { id: mockEmployeeId } });
    
        // Ensure that the result is as expected
        expect(result).toBeUndefined(); // Corrected expectation
    });

    it('should delete an employee with role 2 and handle role-specific logic', async () => {
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

      // Call the method
      const result = await employeeService.deleteEmployeeById(mockEmployeeId);

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

