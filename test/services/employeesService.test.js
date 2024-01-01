const employeeService = require('../../services/employeesService.js');
const buyService = require('../../services/buyService.js');
const db = require('../../models/index.js');


jest.mock('../../models/index.js');

describe('Employee Service', () => {

  const mockEmployees = [
    { id: 1, firstname: 'John', lastname: 'Doe', role: 1 },
    { id: 2, firstname: 'Alice', lastname: 'Smith', role: 2 },
  ];
  const mockRoleId = 1;
  const mockRoleName = 'Manager';

  describe('getEmployees', () => {
    it('should return a list of employees', async () => {
      db.employees.findAll.mockResolvedValue(mockEmployees);

      const result = await employeeService.getEmployees();

      expect(result).toEqual(mockEmployees);
    });
  });

  describe('getRole', () => {
    it('should return the name of an employee\'s role', async () => {
      db.roles.findOne.mockResolvedValue({ name: mockRoleName });

      const result = await employeeService.getRole(mockRoleId);

      expect(result).toBe(mockRoleName);
    });
  });

  describe('getEmployeesByRole', () => {
    it('should return a list of employees with a specific role', async () => {
      db.employees.findAll.mockResolvedValue(mockEmployees);

      const result = await employeeService.getEmployeesByRole(mockRoleId);

      expect(result).toEqual(mockEmployees);
    });
  });

  describe('getEmployeeById', () => {
    it('should return an employee by their id', async () => {
      const mockEmployeeId = 1;
      const mockEmployee = { id: mockEmployeeId, firstname: 'Jane', lastname: 'Doe', role: 1 };

      db.employees.findOne.mockResolvedValue(mockEmployee);

      const result = await employeeService.getEmployeeById(mockEmployeeId);

      expect(result).toEqual(mockEmployee);
    });
  });

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

      db.employees.create.mockResolvedValue(mockNewEmployee);

      const result = await employeeService.addEmployee(
        mockFirstName,
        mockLastName,
        mockMail,
        mockPassword,
        mockRole
      );

      expect(result).toEqual(mockNewEmployee);
    });
  });




  describe('deleteEmployeeById', () => {
    it('should not update delivery information if employee role is not 2', async () => {
        const mockEmployeeId = 1;
        const mockEmployeeWithRole = { id: mockEmployeeId, role: 1 };
    
        db.employees.findOne.mockResolvedValue(mockEmployeeWithRole);
    
        const result = await employeeService.deleteEmployeeById(mockEmployeeId);
    
        expect(db.buy.update).not.toHaveBeenCalled();
    
        expect(db.employees.destroy).toHaveBeenCalledWith({ where: { id: mockEmployeeId } });
    
        expect(result).toBeUndefined(); 
    });

    it('should delete an employee with role 2 and handle role-specific logic', async () => {
      const mockEmployeeId = 2;
      const mockEmployeeWithRole = { id: mockEmployeeId, role: 2 };

      db.employees.findOne.mockResolvedValue(mockEmployeeWithRole);

      db.buy.findOne.mockResolvedValue(null);

      db.buy.update.mockResolvedValue([1]); 

      db.employees.destroy.mockResolvedValue(1);

      const result = await employeeService.deleteEmployeeById(mockEmployeeId);

      expect(db.buy.update).toHaveBeenCalledWith(
          { deliverymanId: null }, 
          { where: { deliverymanId: mockEmployeeId } } 
      );

      expect(db.employees.destroy).toHaveBeenCalledWith({ where: { id: mockEmployeeId } });

      expect(result).toBe(true);
  });

    });
  });

