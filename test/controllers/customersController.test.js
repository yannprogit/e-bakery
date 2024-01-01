///////////////// IMPORT ALL THE FUNCTIONS ////////////////
const { getCustomers, addCustomer, getCustomerById, updateCustomerById, deleteCustomerById} = require('../../controllers/customersController');
const { getCustomerById: getCustomerByIdService, addCustomer: addCustomerService , getCustomers: getCustomersService, updateCustomerByAdmin: updateCustomerByAdminService, updateCustomerByCustomer: updateCustomerByCustomerService, deleteCustomerById: deleteCustomerByIdService} = require('../../services/customersService');
const bcrypt = require('bcrypt');

///////////////// MOCKING THE SERVICES ////////////////
jest.mock('../../services/customersService');
jest.mock('bcrypt');

///////////////// GLOBAL CUSTOMERS ////////////////
describe('Customers Controller', () => {

    /////////////// GET THE LIST OF CUSTOMERS ///////////////
    describe(' Get /customers', () => {
        ///////////////// WHEN IT RETURN THE LIST /////////////////
        it('should get the list of customers', async () => {
            const listCustomers = [
                { id: 1, firstname: 'Yeah', lastname: 'Yoo', mail: 'yeahyoo@gmail.com' },
                { id: 2, firstname: 'L', lastname: 'A', mail: 'LA@gmail.com' },
                { id: 3, firstname: 'G', lastname: 'O', mail: 'GO@gmail.com' }
            ];

            getCustomersService.mockResolvedValue(listCustomers);

            const req = {};
            const res= {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getCustomers({}, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: listCustomers });

            jest.clearAllMocks();
        });
    });

    /////////////// GET A CUSTOMER BY HIS ID ///////////////
    describe('getCustomerById', () => {
      it('should get a customer by ID - status: 200', async () => {
        const mockCustomerId = 1;
        const mockLoggedInUserId = 1;
        const mockRole = 'customer';

        const mockCustomer = { id: mockCustomerId, name: 'John Doe', email: 'john@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
    
        const mockReq = {
          params: { id: mockCustomerId },
          user: { id: mockLoggedInUserId, role: mockRole },
        };

        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        await getCustomerById(mockReq, mockRes, mockLoggedInUserId, mockRole);
    
        expect(getCustomerByIdService).toHaveBeenCalledWith(mockCustomerId);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockCustomer });
      });
    
      it('should return 404 for non-existing customer', async () => {
        const mockCustomerId = 1;
        const mockLoggedInUserId = 1;
        const mockRole = 'customer';
    
        getCustomerByIdService.mockResolvedValueOnce(null);
    
        const mockReq = {
          params: { id: mockCustomerId },
          user: { id: mockLoggedInUserId, role: mockRole },
        };

        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        await getCustomerById(mockReq, mockRes, mockLoggedInUserId, mockRole);

        expect(getCustomerByIdService).toHaveBeenCalledWith(mockCustomerId);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This customer doesn't exist" });
      });
    
      it('should return 403 for unauthorized access', async () => {
        const mockCustomerId = 2; 
        const mockLoggedInUserId = 1;
        const mockRole = 'customer';

        const mockCustomer = { id: mockCustomerId, name: 'Jane Doe', email: 'jane@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);

        const mockReq = {
          params: { id: mockCustomerId },
          user: { id: mockLoggedInUserId, role: mockRole },
        };

        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        await getCustomerById(mockReq, mockRes, mockLoggedInUserId, mockRole);

        expect(getCustomerByIdService).toHaveBeenCalledWith(mockCustomerId);
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Access forbidden: You cannot view an account that does not belong to you' });
      });
    
      it('should allow access for admin', async () => {
        const mockCustomerId = 2;
        const mockLoggedInUserId = 1;
        const mockRole = 'admin';

        const mockCustomer = { id: mockCustomerId, name: 'Jane Doe', email: 'jane@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);

        const mockReq = {
          params: { id: mockCustomerId },
          user: { id: mockLoggedInUserId, role: mockRole },
        };

        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        await getCustomerById(mockReq, mockRes, mockLoggedInUserId, mockRole);

        expect(getCustomerByIdService).toHaveBeenCalledWith(mockCustomerId);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockCustomer });
      });
    });


    ///////////////// ADD A CUSTOMER  //////////////////
    describe('addCustomer', () => {
      it('should add a customer - status: 201', async () => {
        const mockReq = {
          body: {
            firstname: 'John',
            lastname: 'Doe',
            mail: 'john@example.com',
            password: 'password123',
            zipCode: '12345',
            address: '123 Main St',
            town: 'City',
          },
        };

        bcrypt.hash.mockResolvedValue('hashedPassword123');
    
        const mockCustomer = { id: 1, firstname: 'John', lastname: 'Doe', mail: 'john@example.com' };
        addCustomerService.mockResolvedValueOnce(mockCustomer);

        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        await addCustomer(mockReq, mockRes);

        expect(addCustomerService).toHaveBeenCalledWith('John', 'Doe', 'john@example.com', 'hashedPassword123', '12345', '123 Main St', 'City');
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, customer: mockCustomer });
      });
    
      it('should return 422 for an existing mail', async () => {
        const mockReq = {
          body: {
            firstname: 'Jane',
            lastname: 'Doe',
            mail: 'jane@example.com',
            password: 'password456',
            zipCode: '54321',
            address: '456 Main St',
            town: 'City',
          },
        };

        bcrypt.hash.mockResolvedValue('hashedPassword456');

        addCustomerService.mockResolvedValueOnce(null);

        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        await addCustomer(mockReq, mockRes);

        expect(addCustomerService).toHaveBeenCalledWith('Jane', 'Doe', 'jane@example.com', 'hashedPassword456', '54321', '456 Main St', 'City');
        expect(bcrypt.hash).toHaveBeenCalledWith('password456', 10);
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'This mail is already linked on an account' });
      });
    });


    //////////// DELETE A CUSTOMER ////////////
    describe('deleteCustomerById', () => {
      it('should delete a customer - status: 204', async () => {
        const mockReq = {
          params: {
            id: '1',
          },
        };

        const mockCustomer = { id: 1, firstname: 'John', lastname: 'Doe', mail: 'john@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);

        deleteCustomerByIdService.mockResolvedValueOnce(true);

        const mockRes = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
          json: jest.fn(),
        };
    
        await deleteCustomerById(mockReq, mockRes, 1);
    
        expect(getCustomerByIdService).toHaveBeenCalledWith('1');
        expect(deleteCustomerByIdService).toHaveBeenCalledWith('1');
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
      });
    
      it('should return 404 for a non-existent customer', async () => {
        const mockReq = {
          params: {
            id: '1',
          },
        };
        getCustomerByIdService.mockResolvedValueOnce(null);
    
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        await deleteCustomerById(mockReq, mockRes, 1);

        expect(getCustomerByIdService).toHaveBeenCalledWith('1');
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This customer doesn't exist" });
      });
    
      it('should return 403 for a customer that does not belong to the user', async () => {
        const mockReq = {
          params: {
            id: '2',
          },
        };

        const mockCustomer = { id: 2, firstname: 'Jane', lastname: 'Doe', mail: 'jane@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        await deleteCustomerById(mockReq, mockRes, 1);
    
        expect(getCustomerByIdService).toHaveBeenCalledWith('2');
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Access forbidden: You cannot delete an account that does not belong to you' });
      });
    
      it('should return 422 if the customer has deliveries in progress', async () => {
        const mockReq = {
          params: {
            id: '1',
          },
        };
      
        const mockCustomer = { id: 1, firstname: 'John', lastname: 'Doe', mail: 'john@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
        
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        await deleteCustomerById(mockReq, mockRes, 1);

        expect(getCustomerByIdService).toHaveBeenCalledWith('1');
        expect(deleteCustomerByIdService).toHaveBeenCalledWith('1');
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "It would appear that you still have deliveries in progress" });
      });
      
    });

    ///////////////// UPDATE A CUSTOMER  //////////////////
    describe('updateCustomerById', () => {
        it('should update a customer by admin successfully', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    firstname: 'Crost',
                    lastname: 'Ella',
                    mail: 'newemail@example.com',
                    password: 'newpassword',
                    zipCode: 12345,
                    address: 'New Address',
                    town: 'New Town',
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };

            getCustomerByIdService.mockResolvedValueOnce({
                id: 1
            });
    
            updateCustomerByAdminService.mockResolvedValueOnce({
            });

            await updateCustomerById(req, res, 1, 'admin');

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).toHaveBeenCalled();
        });
    
        it('should update a customer by customer successfully', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    mail: 'newemail@example.com',
                    password: 'newpassword',
                    zipCode: 12345,
                    address: 'New Address',
                    town: 'New Town',
                },
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            getCustomerByIdService.mockResolvedValueOnce({
                id: 1,
            });

            updateCustomerByCustomerService.mockResolvedValueOnce({});
    
            await updateCustomerById(req, res, 1, 'customer');
    
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).toHaveBeenCalled();
        });
    
        it('should return 403 status when updating customer with invalid role', async () => {
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
 
            getCustomerByIdService.mockResolvedValueOnce({
                id: 1
            });
        
            await updateCustomerById(req, res, 6, 'invalid_role');
        
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Access forbidden: You cannot modify an account that does not belong to you',
            });
            expect(res.send).not.toHaveBeenCalled();
        });
    
        it('should return 422 status when updating customer with duplicate email', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    firstname: 'Crost',
                    lastname: 'Ella',
                    mail: 'duplicate@example.com',
                    password: 'newpassword',
                    zipCode: 12345,
                    address: 'New Address',
                    town: 'New Town',
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
        
            getCustomerByIdService.mockResolvedValueOnce({
                id: 1
            });

            updateCustomerByAdminService.mockResolvedValueOnce(null);

            await updateCustomerById(req, res, 1, 'admin');
        
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'This mail is already linked on an account',
            });
            expect(res.send).not.toHaveBeenCalled();
        });
    
        it('should return 422 status when updating customer by customer with duplicate email', async () => {
            const req = {
                params: {
                    id: 1,
                },
                body: {
                    mail: 'newemail@example.com',
                    password: 'newpassword',
                    zipCode: 12345,
                    address: 'New Address',
                    town: 'New Town',
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
        
            getCustomerByIdService.mockResolvedValueOnce({
                id: 1
            });

            updateCustomerByCustomerService.mockResolvedValueOnce(null);

            await updateCustomerById(req, res, 1, 'customer');

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'This mail is already linked on an account',
            });
            expect(res.send).not.toHaveBeenCalled();
        });
    
        it('should return 400 status when updating customer by admin with invalid request body', async () => {
            const req = {
                params: {
                    id: 1
                },
                body: {

                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
        
            getCustomerByIdService.mockResolvedValueOnce({
                id: 1
            });
        
            await updateCustomerById(req, res, 1, 'admin');

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: expect.any(Array),
            });
            expect(res.send).not.toHaveBeenCalled();
        });
    
        it('should return 400 status when updating customer by customer with invalid request body', async () => {
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
        
            getCustomerByIdService.mockResolvedValueOnce({
                id: 1
            });

            await updateCustomerById(req, res, 1, 'customer');
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: expect.any(Array),
            });
            expect(res.send).not.toHaveBeenCalled();
        });
    
        it('should return 404 status when updating non-existent customer', async () => {
            const req = {
                params: {
                    id: 12313,
                },
                body: {
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
        
            getCustomerByIdService.mockResolvedValueOnce(null); 
        
            await updateCustomerById(req, res,1, 'admin');
        
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "This customer doesn't exist",
            });
            expect(res.send).not.toHaveBeenCalled();
        });
    });
});
