///////////////// IMPORT ALL THE FUNCTIONS ////////////////
const { getEmployees, getEmployeesByRole, addEmployee, deleteEmployeeById, getEmployeeById, updateEmployeeById} = require('../../controllers/employeesController');
const { getEmployees : getEmployeesService, getEmployeesByRole : getEmployeesByRoleService, addEmployee : addEmployeeService, deleteEmployeeById : deleteEmployeeByIdService, getEmployeeById : getEmployeeByIdService, updateEndContract : updateEndContractService, updateEmployeeByAdmin : updateEmployeeByAdminService, updateEmployeeByEmployee : updateEmployeeByEmployeeService} = require('../../services/employeesService');
const bcrypt = require('bcrypt');

///////////////// MOCKING THE SERVICES ////////////////
jest.mock('../../services/employeesService');
jest.mock('bcrypt');

///////////////// GLOBAL EMPLOYEE CONTROLLER ////////////////
describe('Employees Controller', () => {

    ///////////////// GET EMPLOYEES ////////////////
    describe(' Get /employees ', () => {
        it('should get the list of employees', async () => {
            const mockEmployees = [
                { id: 1, firstname: 'John', lastname: 'Doe', mail: 'rdgbhrg@gmail.com', password: 'fsefsef51fsef', role : 4, endContract : '12/11/2055' },
                { id: 1, firstname: 'GREZ', lastname: 'DRG', mail: 'GREZG@gmail.com', password: 'fsefsef51fsef', role : 2, endContract : '12/11/2055' }
            ];

            getEmployeesService.mockResolvedValue(mockEmployees);

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getEmployees({}, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockEmployees });
        });
    });
    
    
    ///////////////// GET EMPLOYEES BY ROLE ////////////////
    describe('getEmployeesByRole', () => {
        it('should get the list of employees by their role', async () => {
          const mockReq = {
            params: { id: 1 },
          };

          const mockEmployees = [
            { id: 1, name: 'John Doe', role: 3 },
            { id: 2, name: 'Jane Smith', role: 5 },
          ];

          getEmployeesByRoleService.mockResolvedValue(mockEmployees);

          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };

          await getEmployeesByRole(mockReq, mockRes);

          expect(mockRes.status).toHaveBeenCalledWith(200);
          expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockEmployees });
        });
      });

      ///////////////// GET EMPLOYEE BY ID ////////////////
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
      
          getEmployeeByIdService.mockResolvedValue({
              id: 1,
              name: 'John Doe',
              role: 'employee',
          });
      
          await getEmployeeById(req, res, 1, 'admin');
      
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
    
            getEmployeeByIdService.mockResolvedValue(null);
    
            await getEmployeeById(req, res, 'admin');
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

            getEmployeeByIdService.mockResolvedValue({
                id: 'employeeId123',
                name: 'John Doe',
                role: 'employee',
            });

            await getEmployeeById(req, res, 'otherEmployeeId', 'manager');
    
            // Assertions
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Access forbidden: You cannot view an account that does not belong to you' });
        });
    });


        ///////////////// ADD EMPLOYEE ////////////////
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
                        role: 1,
                    },
                };

                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                };

                await addEmployee(req, res, 'manager');

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
                        role: 2,
                    },
                };

                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                };

                bcrypt.hash.mockResolvedValue('hashedPassword');
                addEmployeeService.mockResolvedValue(null); 

                await addEmployee(req, res, 'manager');

                expect(res.status).toHaveBeenCalledWith(422);
                expect(res.json).toHaveBeenCalledWith({ success: false, message: 'This mail is already linked on an account' });
            });
        });



        ///////////////// DELETE EMPLOYEE ////////////////
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
      
              getEmployeeByIdService.mockResolvedValue({
                  id: 'employeeId123',
                  name: 'John Doe',
                  role: 'employee',
              });

              deleteEmployeeByIdService.mockResolvedValue(true);
      
              await deleteEmployeeById(req, res, 'admin');

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

              getEmployeeByIdService.mockResolvedValue(null);
      
              await deleteEmployeeById(req, res, 'admin');

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

            getEmployeeByIdService.mockResolvedValue({
                id: 'employeeId123',
                name: 'Manager Doe',
                role: 1,
            });
        
            await deleteEmployeeById(req, res, 'otherManagerId', 'manager');
        
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

            getEmployeeByIdService.mockResolvedValue({
                id: 'employeeId123',
                name: 'John Doe',
                role: 'employee',
            });

            deleteEmployeeByIdService.mockResolvedValue(false);

            await deleteEmployeeById(req, res, 'admin');

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "This deliveryman has unfinished deliveries" });
        });
    });

    ///////////////// UPDATE AN EMPLOYEE //////////////////
    describe('updateEmployeeById', () => {
        it('should update an employee by admin successfully', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    firstname: 'Emplo',
                    lastname: 'Yee',
                    mail: 'employee@example.com',
                    password: 'password'
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            getEmployeeByIdService.mockResolvedValueOnce({
                id: 1
            });
    
            updateEmployeeByAdminService.mockResolvedValueOnce({});

            await updateEmployeeById(req, res, 1, 'admin');
    
            expect(res.status).toHaveBeenCalledWith(204); 
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).toHaveBeenCalled();
        });

        it('should update a employee by employee successfully', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    mail: 'employee@example.com',
                    password: 'password',
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };

            getEmployeeByIdService.mockResolvedValueOnce({
                id: 1,
            });

            updateEmployeeByEmployeeService.mockResolvedValueOnce({});
    
            await updateEmployeeById(req, res, 1, 'employee');
    
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).toHaveBeenCalled();
        });

        it('should update employee endContract by manager successfully', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    endContract: '2024-12-31',
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            getEmployeeByIdService.mockResolvedValueOnce(1);
    
            updateEndContractService.mockResolvedValueOnce({});
    
            await updateEmployeeById(req, res, 1, 'manager');
    
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).toHaveBeenCalled();
        });

        it('should handle invalid endContract date with 400 status', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    endContract: 'invalid_date',
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            getEmployeeByIdService.mockResolvedValueOnce(1);
    
            await updateEmployeeById(req, res, 1, 'manager');
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'endContract must be a valid date',
            });
            expect(res.send).not.toHaveBeenCalled();
        });

        it('should handle forbidden access for manager updating another manager or admin account', async () => {
            const req = {
                params: {
                    id: 2, 
                },
                body: {
                    endContract: '2024-12-31',
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            const managerMock = {
                id: 1,
                role: 5,
            };
    
            getEmployeeByIdService.mockResolvedValueOnce(managerMock);
    
            await updateEmployeeById(req, res, 1, 'manager');
    
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Access forbidden: You cannot modify the account of an admin or another manager',
            });
            expect(res.send).not.toHaveBeenCalled();
        });

        it('should handle updating with a past endContract date with 422 status', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    endContract: '2022-01-01',
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            getEmployeeByIdService.mockResolvedValueOnce(1);
    
            await updateEmployeeById(req, res, 1, 'manager');
    
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'This date has passed',
            });
            expect(res.send).not.toHaveBeenCalled();
        });

        it('should handle scheduled deliveries after new contract end date with 422 status', async () => {
            const req = {
                params: {
                    id: 3,
                },
                body: {
                    endContract: '2024-12-01'
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            getEmployeeByIdService.mockResolvedValueOnce(1);
    
            //Mocking updateEndContract to directly return false
            updateEndContractService.mockResolvedValueOnce(false);
    
            await updateEmployeeById(req, res, 1, 'manager');
    
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Deliveries are scheduled after the new contract end date',
            });
            expect(res.send).not.toHaveBeenCalled();
        });

        it('should handle updating an account that does not belong to the employee with 403 status', async () => {
            const req = {
                params: {
                    id: 2, 
                },
                body: {
                    mail: 'employee@example.com',
                    password: 'password',                    
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            getEmployeeByIdService.mockResolvedValueOnce(1);
    
            await updateEmployeeById(req, res, 1, 'employee');
    
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Access forbidden: You cannot modify an account that does not belong to you',
            });
            expect(res.send).not.toHaveBeenCalled();
        });

        it('should return 422 status when updating employee with duplicate email by admin', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    firstname: 'Emplo',
                    lastname: 'Yee',
                    mail: 'duplicate@example.com',
                    password: 'password'
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
        
            getEmployeeByIdService.mockResolvedValueOnce({
                id: 1,
            });
        
            updateEmployeeByAdminService.mockResolvedValueOnce(null);
        
            await updateEmployeeById(req, res, 1, 'admin');
        
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'This mail is already linked on an account',
            });
            expect(res.send).not.toHaveBeenCalled();
        });

        it('should return 422 status when updating employee with duplicate email by employee', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    mail: 'duplicate@example.com',
                    password: 'password'
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
        
            getEmployeeByIdService.mockResolvedValueOnce({
                id: 1,
            });
        
            updateEmployeeByEmployeeService.mockResolvedValueOnce(null);
        
            await updateEmployeeById(req, res, 1, 'employee');
        
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'This mail is already linked on an account',
            });
            expect(res.send).not.toHaveBeenCalled();
        });

        it('should return 400 status when updating employee by admin with invalid request body', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
        
            getEmployeeByIdService.mockResolvedValueOnce({
                id: 1
            });
        
            await updateEmployeeById(req, res, 1, 'admin');
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: expect.any(Array),
            });
            expect(res.send).not.toHaveBeenCalled();
        });

        it('should return 400 status when updating employee by employee with invalid request body', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
        
            getEmployeeByIdService.mockResolvedValueOnce({
                id: 1
            });
        
            await updateEmployeeById(req, res, 1, 'employee');
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: expect.any(Array),
            });
            expect(res.send).not.toHaveBeenCalled();
        });

        it('should return 404 status when updating non-existent employee', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
        
            getEmployeeByIdService.mockResolvedValueOnce(null);
        
            await updateEmployeeById(req, res, 1, 'admin');
        
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "This employee doesn't exist",
            });
            expect(res.send).not.toHaveBeenCalled();
        });
    });
});
