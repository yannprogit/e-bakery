// Import required modules and the controller (functions)
const { getCustomers,addCustomer, getCustomerById, updateCustomerById, updateCustomerByAdmin, updateCustomerByCustomer, deleteCustomerById} = require('../../controllers/customersController');
const { getCustomerById: getCustomerByIdService, addCustomer: addCustomerService , getCustomers: getCustomersService, updateCustomerById: updateCustomerByIdService, updateCustomerByAdmin: updateCustomerByAdminService, updateCustomerByCustomer: updateCustomerByCustomerService, deleteCustomerById: deleteCustomerByIdService} = require('../../services/customersService');
const bcrypt = require('bcrypt');

// Mocking the services
jest.mock('../../services/customersService');
jest.mock('bcrypt');

///////////////// GLOBAL CUSTOMERS ////////////////
describe('Customers Controller', () => {

    /////////////// GET THE LIST OF CUSTOMERS ///////////////
    describe(' Get /customers', () => {
        ///////////////// WHEN IT RETURN THE LIST /////////////////
        it('should get the list of customers', async () => {
            // Mock of the data of the customer in the database
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

            // Reset mock
            jest.clearAllMocks();
        });
    });

    /////////////// GET A CUSTOMER BY HIS ID ///////////////
    describe('getCustomerById', () => {
      it('should get a customer by ID - status: 200', async () => {
        // Arrange
        const mockCustomerId = 1;
        const mockLoggedInUserId = 1;
        const mockRole = 'customer';
    
        // Mock the getCustomerById function to return a customer
        const mockCustomer = { id: mockCustomerId, name: 'John Doe', email: 'john@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
    
        // Mock the request object
        const mockReq = {
          params: { id: mockCustomerId },
          user: { id: mockLoggedInUserId, role: mockRole },
        };
    
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Act
        await getCustomerById(mockReq, mockRes, mockLoggedInUserId, mockRole);
    
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith(mockCustomerId);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockCustomer });
      });
    
      it('should return 404 for non-existing customer', async () => {
        // Arrange
        const mockCustomerId = 1;
        const mockLoggedInUserId = 1;
        const mockRole = 'customer';
    
        // Mock the getCustomerById function to return null (indicating that the customer doesn't exist)
        getCustomerByIdService.mockResolvedValueOnce(null);
    
        // Mock the request object
        const mockReq = {
          params: { id: mockCustomerId },
          user: { id: mockLoggedInUserId, role: mockRole },
        };
    
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Act
        await getCustomerById(mockReq, mockRes, mockLoggedInUserId, mockRole);
    
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith(mockCustomerId);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This customer doesn't exist" });
      });
    
      it('should return 403 for unauthorized access', async () => {
        // Arrange
        const mockCustomerId = 2; // Different customer ID
        const mockLoggedInUserId = 1;
        const mockRole = 'customer';
    
        // Mock the getCustomerById function to return a customer with a different ID
        const mockCustomer = { id: mockCustomerId, name: 'Jane Doe', email: 'jane@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
    
        // Mock the request object
        const mockReq = {
          params: { id: mockCustomerId },
          user: { id: mockLoggedInUserId, role: mockRole },
        };
    
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Act
        await getCustomerById(mockReq, mockRes, mockLoggedInUserId, mockRole);
    
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith(mockCustomerId);
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Access forbidden: You cannot view an account that does not belong to you' });
      });
    
      it('should allow access for admin', async () => {
        // Arrange
        const mockCustomerId = 2; // Different customer ID
        const mockLoggedInUserId = 1;
        const mockRole = 'admin';
    
        // Mock the getCustomerById function to return a customer with a different ID
        const mockCustomer = { id: mockCustomerId, name: 'Jane Doe', email: 'jane@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
    
        // Mock the request object
        const mockReq = {
          params: { id: mockCustomerId },
          user: { id: mockLoggedInUserId, role: mockRole },
        };
    
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Act
        await getCustomerById(mockReq, mockRes, mockLoggedInUserId, mockRole);
    
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith(mockCustomerId);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockCustomer });
      });
    });


    ///////////////// POST ADD A CUSTOMER  //////////////////
    describe('addCustomer', () => {
      it('should add a customer - status: 201', async () => {
        // Arrange
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
    
        // Mock bcrypt.hash to return a hashed password
        bcrypt.hash.mockResolvedValue('hashedPassword123');
    
        // Mock the addCustomer function to return a customer
        const mockCustomer = { id: 1, firstname: 'John', lastname: 'Doe', mail: 'john@example.com' };
        addCustomerService.mockResolvedValueOnce(mockCustomer);
    
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Act
        await addCustomer(mockReq, mockRes);
    
        // Assert
        expect(addCustomerService).toHaveBeenCalledWith('John', 'Doe', 'john@example.com', 'hashedPassword123', '12345', '123 Main St', 'City');
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, customer: mockCustomer });
      });
    
      it('should return 422 for an existing mail', async () => {
        // Arrange
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
    
        // Mock bcrypt.hash to return a hashed password
        bcrypt.hash.mockResolvedValue('hashedPassword456');
    
        // Mock the addCustomer function to return null (indicating that the mail is already linked to an account)
        addCustomerService.mockResolvedValueOnce(null);
    
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Act
        await addCustomer(mockReq, mockRes);
    
        // Assert
        expect(addCustomerService).toHaveBeenCalledWith('Jane', 'Doe', 'jane@example.com', 'hashedPassword456', '54321', '456 Main St', 'City');
        expect(bcrypt.hash).toHaveBeenCalledWith('password456', 10);
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'This mail is already linked on an account' });
      });
    });


    //////////// DELETE A CUSTOMER ////////////
    describe('deleteCustomerById', () => {
      it('should delete a customer - status: 204', async () => {
        // Arrange
        const mockReq = {
          params: {
            id: '1',
          },
        };
    
        // Mock the getCustomerById function to return a customer
        const mockCustomer = { id: 1, firstname: 'John', lastname: 'Doe', mail: 'john@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
    
        // Mock the deleteCustomerByIdService function to indicate successful deletion
        deleteCustomerByIdService.mockResolvedValueOnce(true);
    
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
          json: jest.fn(),
        };
    
        // Act
        await deleteCustomerById(mockReq, mockRes, 1);
    
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith('1');
        expect(deleteCustomerByIdService).toHaveBeenCalledWith('1');
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled(); // Assuming there's no JSON response for a successful deletion
      });
    
      it('should return 404 for a non-existent customer', async () => {
        // Arrange
        const mockReq = {
          params: {
            id: '1',
          },
        };
    
        // Mock the getCustomerById function to return null (indicating a non-existent customer)
        getCustomerByIdService.mockResolvedValueOnce(null);
    
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Act
        await deleteCustomerById(mockReq, mockRes, 1);
    
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith('1');
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This customer doesn't exist" });
      });
    
      it('should return 403 for a customer that does not belong to the user', async () => {
        // Arrange
        const mockReq = {
          params: {
            id: '2',
          },
        };
    
        // Mock the getCustomerById function to return a customer with a different ID
        const mockCustomer = { id: 2, firstname: 'Jane', lastname: 'Doe', mail: 'jane@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
    
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Act
        await deleteCustomerById(mockReq, mockRes, 1);
    
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith('2');
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Access forbidden: You cannot delete an account that does not belong to you' });
      });
    
      it('should return 422 if the customer has deliveries in progress', async () => {
        // Arrange
        const mockReq = {
          params: {
            id: '1',
          },
        };
      
        // Mock the getCustomerById function to return a customer
        const mockCustomer = { id: 1, firstname: 'John', lastname: 'Doe', mail: 'john@example.com' };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
        
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        // Act
        await deleteCustomerById(mockReq, mockRes, 1);
      
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith('1');
        expect(deleteCustomerByIdService).toHaveBeenCalledWith('1');
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "It would appear that you still have deliveries in progress" });
      });
      
    });


    ////// UPDATE A CUSTOMER ///////
    describe('updateCustomerById', () => {
      it('should update a customer by admin - status: 204', async () => {
        // Arrange
        const mockReq = {
          params: {
            id: '1',
          },
          body: {
            firstname: 'John',
            lastname: 'Doe',
            mail: 'john@example.com',
            password: 'newPassword',
            zipCode: '12345',
            address: '123 Main St',
            town: 'City'
          }
        };
  
        // Mock the getCustomerById function to return a customer
        const mockCustomer = {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          mail: 'john@example.com'
        };
  
        
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
        bcrypt.hash.mockResolvedValue('hashedPassword123');
        // Mock the updateCustomerByAdminService function to update the customer
        updateCustomerByAdminService.mockResolvedValueOnce(mockCustomer);
  
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
          json: jest.fn(),
        };
  
        // Act
        await updateCustomerById(mockReq, mockRes, 1, 'admin');
  
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith('1');
        expect(updateCustomerByAdminService).toHaveBeenCalledWith(
          '1',
          'John',
          'Doe',
          'john@example.com',
          'hashedPassword123',
          '12345',
          '123 Main St',
          'City'
        );
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
      });
  
      it('should update a customer by customer - status: 204', async () => {
        // Arrange
        const mockReq = {
          params: {
            id: '1',
          },
          body: {
            mail: 'john@example.com',
            password: 'newPassword',
            zipCode: '12345',
            address: '123 Main St',
            town: 'City'
          }
        };
  
        // Mock the getCustomerById function to return a customer
        const mockCustomer = {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          mail: 'john@example.com'
        };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
        bcrypt.hash.mockResolvedValue('hashedPassword123');
  
        // Mock the updateCustomerByCustomerService function to update the customer
        updateCustomerByCustomerService.mockResolvedValueOnce(mockCustomer);
  
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
          json: jest.fn(),
        };
  
        // Act
        await updateCustomerById(mockReq, mockRes, 1, 'customer');
  
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith('1');
        expect(updateCustomerByCustomerService).toHaveBeenCalledWith(
          '1',
          'john@example.com',
          'hashedPassword123',
          '12345',
          '123 Main St',
          'City'
        );
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
      });
  
      it('should return 422 if mail is already linked to an account', async () => {
        // Arrange
        const mockReq = {
          params: {
            id: '1',
          },
          body: {
            firstname: 'John',
            lastname: 'Doe',
            mail: 'john@example.com',
            password: 'newPassword',
            zipCode: '12345',
            address: '123 Main St',
            town: 'City'
          }
        };
  
        // Mock the getCustomerById function to return a customer
        const mockCustomer = {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          mail: 'john@example.com'
        };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
        bcrypt.hash.mockResolvedValue('hashedPassword123');
  
        // Mock the updateCustomerByAdminService function to indicate that mail is already linked
        updateCustomerByAdminService.mockResolvedValueOnce(null);
  
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Act
        await updateCustomerById(mockReq, mockRes, 1, 'admin');
  
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith('1');
        expect(updateCustomerByAdminService).toHaveBeenCalledWith(
          '1',
          'John',
          'Doe',
          'john@example.com',
          'hashedPassword123',
          '12345',
          '123 Main St',
          'City'
        );
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This mail is already linked on an account" });
      });
  
      it('should return 403 for unauthorized update attempt', async () => {
        // Arrange
        const mockReq = {
          params: {
            id: '1',
          },
          body: {
            mail: 'john@example.com',
            password: 'newPassword',
            zipCode: '12345',
            address: '123 Main St',
            town: 'City'
          }
        };
  
        // Mock the getCustomerById function to return a customer
        const mockCustomer = {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          mail: 'john@example.com'
        };
        getCustomerByIdService.mockResolvedValueOnce(mockCustomer);
  
        // Mock the response object
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Act
        await updateCustomerById(mockReq, mockRes, 1, 'invalidRole');
  
        // Assert
        expect(getCustomerByIdService).toHaveBeenCalledWith('1');
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Access forbidden: You cannot modify an account that does not belong to you' });
      });
    });
   
});
