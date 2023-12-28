// Import required modules and the controller (functions)
const { getEmployees, getEmployeesByRole, addEmployee, deleteEmployeeById, getEmployeeById, updateEndContract, updateEmployeeByAdmin} = require('../../controllers/employeesController');
const { getEmployees : getEmployeesService, getEmployeesByRole : getEmployeesByRoleService, addEmployee : addEmployeeService, deleteEmployeeById : deleteEmployeeByIdService, getEmployeeById : getEmployeeByIdService, updateEndContract : updateEndContractService, updateEmployeeByAdmin : updateEmployeeByAdminService} = require('../../services/employeesService');
const bcrypt = require('bcrypt');

jest.mock('../../services/employeesService');
jest.mock('bcrypt');


describe('Employees Controller', () => {
    
    describe(' Get /employees ', () => {
        it('should get the list of employees', async () => {
            // Mock data for the list of employees
            const mockEmployees = [
                { id: 1, firstname: 'John', lastname: 'Doe', mail: 'rdgbhrg@gmail.com', password: 'fsefsef51fsef', role : 'boulangaire', endContract : '12/11/2055' },
                { id: 1, firstname: 'John', lastname: 'Doe', mail: 'rdgbhrg@gmail.com', password: 'fsefsef51fsef', role : 'yes', endContract : '12/11/2055' }
            ];

            // Mock the behavior of getEmployees service
            getEmployeesService.mockResolvedValue(mockEmployees);

            // Mock Express response object
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Call the getEmployees method
            await getEmployees({}, mockRes);

            // Verify that the response is as expected
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockEmployees });
        });
    });
    
    

    describe('getEmployeesByRole', () => {
        it('should get the list of employees by their role', async () => {
          // Mock data for the request
          const mockReq = {
            params: { id: 1 },
          };
      
          // Mock data for the response
          const mockEmployees = [
            { id: 1, name: 'John Doe', role: 'Engineer' },
            { id: 2, name: 'Jane Smith', role: 'Manager' },
          ];
      
          // Mock the behavior of the getEmployeesByRole service
          getEmployeesByRoleService.mockResolvedValue(mockEmployees);
      
          // Mock Express response object
          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Call the getEmployeesByRole method
          await getEmployeesByRole(mockReq, mockRes);
      
          // Verify that the response is as expected
          expect(mockRes.status).toHaveBeenCalledWith(200);
          expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockEmployees });
        });
      });

      describe('getEmployeeById', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
    
        it('should return employee data when accessed by admin', async () => {
          const req = {
              params: {
                  id: 1,
              },
          };
      
          const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
          };
      
          // Mock getEmployeeById function
          getEmployeeByIdService.mockResolvedValue({
              id: 1,
              name: 'John Doe',
              role: 'employee',
          });
      
          await getEmployeeById(req, res, 1, 'admin'); // Pass the admin's ID as the third argument
      
          // Assertions
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({ success: true, data: expect.any(Object) });
      });
    
        it('should return 404 error when employee does not exist', async () => {
            const req = {
                params: {
                    id: 'nonexistentEmployeeId',
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Mock getEmployeeById function to simulate a non-existent employee
            getEmployeeByIdService.mockResolvedValue(null);
    
            await getEmployeeById(req, res, 'admin');
    
            // Assertions
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "This employee doesn't exist" });
        });
    
        it('should return 403 error when unauthorized access is attempted', async () => {
            const req = {
                params: {
                    id: 'employeeId123',
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Mock getEmployeeById function to simulate an existing employee
            getEmployeeByIdService.mockResolvedValue({
                id: 'employeeId123',
                name: 'John Doe',
                role: 'employee',
            });
    
            // Attempt unauthorized access (e.g., manager accessing another employee's data)
            await getEmployeeById(req, res, 'otherEmployeeId', 'manager');
    
            // Assertions
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Access forbidden: You cannot view an account that does not belong to you' });
        });
    });



      describe('addEmployee', () => {
            afterEach(() => {
                jest.clearAllMocks();
            });

            it('should return success when adding a valid employee', async () => {
                const req = {
                    body: {
                        firstname: 'John',
                        lastname: 'Doe',
                        mail: 'john.doe@example.com',
                        password: 'password123',
                        role: 2,
                    },
                };

                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                };

                bcrypt.hash.mockResolvedValue('hashedPassword');

                addEmployeeService.mockResolvedValue({
                    firstname: 'John',
                    lastname: 'Doe',
                    mail: 'john.doe@example.com',
                    role: 2,
                });

                await addEmployee(req, res, 'manager');

                // Assertions
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith({ success: true, data: expect.any(Object) });
            });

            it('should return an error when trying to create an admin account as a manager', async () => {
                const req = {
                    body: {
                        firstname: 'Admin',
                        lastname: 'User',
                        mail: 'admin@example.com',
                        password: 'admin123',
                        role: 1, // Admin role
                    },
                };

                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                };

                await addEmployee(req, res, 'manager');

                // Assertions
                expect(res.status).toHaveBeenCalledWith(422);
                expect(res.json).toHaveBeenCalledWith({ success: false, message: 'You cannot create an admin account' });
            });

            it('should return an error when the email is already linked to an account', async () => {
                const req = {
                    body: {
                        firstname: 'Duplicate',
                        lastname: 'User',
                        mail: 'duplicate@example.com',
                        password: 'duplicate123',
                        role: 2, // Assuming role 2 is a regular employee
                    },
                };

                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                };

                bcrypt.hash.mockResolvedValue('hashedPassword');
                addEmployeeService.mockResolvedValue(null); // Simulate existing email

                await addEmployee(req, res, 'manager');

                // Assertions
                expect(res.status).toHaveBeenCalledWith(422);
                expect(res.json).toHaveBeenCalledWith({ success: false, message: 'This mail is already linked on an account' });
            });
        });




        describe('deleteEmployeeById', () => {
          afterEach(() => {
              jest.clearAllMocks();
          });
      
          it('should delete an employee when accessed by admin', async () => {
              const req = {
                  params: {
                      id: 'employeeId123',
                  },
              };
      
              const res = {
                  status: jest.fn().mockReturnThis(),
                  json: jest.fn(),
                  send: jest.fn(),
              };
      
              // Mock getEmployeeById function to simulate an existing employee
              getEmployeeByIdService.mockResolvedValue({
                  id: 'employeeId123',
                  name: 'John Doe',
                  role: 'employee',
              });
      
              // Mock deleteEmployeeById function to simulate successful deletion
              deleteEmployeeByIdService.mockResolvedValue(true);
      
              await deleteEmployeeById(req, res, 'admin');
      
              // Assertions
              expect(res.status).toHaveBeenCalledWith(204);
              expect(res.send).toHaveBeenCalled();
          });
      
          it('should return 404 error when employee does not exist', async () => {
              const req = {
                  params: {
                      id: 'nonexistentEmployeeId',
                  },
              };
      
              const res = {
                  status: jest.fn().mockReturnThis(),
                  json: jest.fn(),
                  send: jest.fn(),
              };
      
              // Mock getEmployeeById function to simulate a non-existent employee
              getEmployeeByIdService.mockResolvedValue(null);
      
              await deleteEmployeeById(req, res, 'admin');
      
              // Assertions
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith({ success: false, message: "This employee doesn't exist" });
          });
      
          it('should return 403 error when a manager attempts to delete another manager\'s account', async () => {
            const req = {
                params: {
                    id: 'employeeId123',
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
        
            // Mock getEmployeeById function to simulate an existing employee (manager)
            getEmployeeByIdService.mockResolvedValue({
                id: 'employeeId123',
                name: 'Manager Doe',
                role: 1, // Assuming role number for manager is 1
            });
        
            // Mock deleteEmployeeById function (not needed for this specific test)
        
            await deleteEmployeeById(req, res, 'otherManagerId', 'manager');
        
            // Assertions
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Access forbidden: You cannot delete another manager's account or admin's account" });
        });


          it('should return 422 error when employee has unfinished deliveries', async () => {
            const req = {
                params: {
                    id: 'employeeId123',
                },
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };

            // Mock getEmployeeById function to simulate an existing employee
            getEmployeeByIdService.mockResolvedValue({
                id: 'employeeId123',
                name: 'John Doe',
                role: 'employee',
            });

            // Mock deleteEmployeeById function to simulate unfinished deliveries
            deleteEmployeeByIdService.mockResolvedValue(false);

            await deleteEmployeeById(req, res, 'admin');

            // Assertions
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "This deliveryman has unfinished deliveries" });
        });
      });
});
