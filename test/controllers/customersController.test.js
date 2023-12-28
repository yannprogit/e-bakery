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
    describe('GET /customers By ID', () => {
        ////////// CUSTOMER ID DIFFERENT FROM THE ID INPUT /////////
        it('access denied when customer ID does not match', async () => {
            // Mock data for the request in the URL
            const req = {
                params: {
                    id: '2'
                },
            };

            // Mock of the data of the customer in the database
            const customer = { id: 1, firstname: 'Yeah', lastname: 'Yoo', mail: 'yeahyoo@gmail.com' };

            // Mocking the functionality of the function
            getCustomerByIdService.mockResolvedValue(customer);

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getCustomerById(req, res, 2, 'customer');

            /* You need to have the same message than customersController.js
                Or it won't work because it doesn't receive the same message */
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Access forbidden: You cannot view an account that does not belong to you" });

            // Reset mock
            jest.clearAllMocks();
        });

        /////////// CANT FIND THE CUSTOMER BY HIS ID /////////////
        it('cant find a customer by his id', async () => {
            const req = {
                params: {
                    id: '2'
                },
            };

            const customer = { id: 1, firstname: 'Yeah', lastname: 'Yoo', mail: 'yeahyoo@gmail.com' };

            // When id is null
            getCustomerByIdService.mockResolvedValue(null);

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getCustomerById(req, res, 1);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "This customer doesn't exist" });

            jest.clearAllMocks();
        });




        //////// GET A CUSTOMER BY HIS ID AND THE ROLE MATCH ////////
        it('should get a customer by his id', async () => {
            const req = {
                params: {
                    id: '1'
                },
            };

            const customer = { id: 1, firstname: 'Yeah', lastname: 'Yoo', mail: 'yeahyoo@gmail.com' };

            getCustomerByIdService.mockResolvedValue(customer);

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getCustomerById(req, res, 1);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: customer });

            jest.clearAllMocks();
        });
        
    });


    ///////////////// POST ADD A CUSTOMER  //////////////////
    describe('POST adding a customer', () => {
        ///////////// SUCCESSFULLY ADDED A CUSTOMER  /////////////////////
        it('should add a customer successfully', async () => {
            const req = {
                body: {
                    firstname: 'Jean',
                    lastname: 'Quartier',
                    mail: 'jeanquartier@example.com',
                    password: 'securepassword',
                    zipCode: '5182',
                    address: '5_Chevals_de_la_gallerie',
                    town: 'Roiroi'
                },
            };

            const hashedPassword = '$2a$10$SomeHashedPassword';

            const customer = {
                id: 'CustomerId',
                firstname: 'Jean',
                lastname: 'Quartier',
                mail: 'jeanquatier@example.com',
                zipCode: '5182',
                address: '5_Chevals_de_la_gallerie',
                town: 'Roiroi'
            };

            bcrypt.hash.mockResolvedValue(hashedPassword);
            addCustomerService.mockResolvedValue(customer);

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Calling the function
            await addCustomer(req, res);

            // Assertions
            expect(bcrypt.hash).toHaveBeenCalledWith('securepassword', 10);
            expect(addCustomerService).toHaveBeenCalledWith(
                'Jean',
                'Quartier',
                'jeanquartier@example.com',
                hashedPassword,
                '5182',
                '5_Chevals_de_la_gallerie',
                'Roiroi'
            );

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                customer: customer,
            });

            // Reset mock
            jest.clearAllMocks();
        });

        ///////////////// FAILED TO ADD A CUSTOMER  ///////////////////////
        it('should return 400 if customer creation fails', async () => {
          const req = {
            body: {
                firstname: 'Jean',
                lastname: 'Quartier',
                mail: 'jeanquartier@example.com',
                password: 'securepassword',
                zipCode: '5182',
                address: '5_Chevals_de_la_gallerie',
                town: 'Roiroi'
            },
          };

          const hashedPassword = '$2a$10$SomeHashedPassword';

          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
        addCustomerService.mockResolvedValueOnce(null)
    
          await addCustomer(req, res);
    
          expect(addCustomerService).toHaveBeenCalledWith(
            'Jean',
            'Quartier',
            'jeanquartier@example.com',
            hashedPassword,
            '5182',
            '5_Chevals_de_la_gallerie',
            'Roiroi'
          );

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error when creating this customer, verify your args" });

            jest.clearAllMocks();
        });
    });


    //////////// DELETE A CUSTOMER ////////////
    describe('DELETE deleteCustomerById', () => { 
    
        /////// CUSTOMER DONT EXIST ////////
        it('should return 404 if customer does not exist', async () => {
            const req = {
              params: {
                id: 'CustomerIdNotFound',
              },
            };
      
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
              send: jest.fn(),
            };
      
            getCustomerByIdService.mockResolvedValueOnce(null);
      
            await deleteCustomerById(req, res, 'authenticatedUserId', 'admin');
      
            expect(getCustomerByIdService).toHaveBeenCalledWith('CustomerIdNotFound');

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "This customer doesn't exist" });
    
            jest.clearAllMocks();
          });
          
          ///////// SUCCESSFULLY DELETED CUSTOMER  ///////////
          it('should delete a customer successfully', async () => {
            const req = {
              params: {
                id: 'customerId',
              },
            };
    
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
              send: jest.fn(),
            };
    
            getCustomerByIdService.mockResolvedValueOnce({ id: 'customerId' });
    
            deleteCustomerByIdService.mockResolvedValueOnce(true);
    
            // Call the controller function
            await deleteCustomerById(req, res, 'authenticatedUserId', 'admin');
    
            // Assertions
            expect(getCustomerByIdService).toHaveBeenCalledWith('customerId');
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
    
                jest.clearAllMocks();
          });
    
          //////// FAILED TO DELETE IF DELEVERY IS NOT DELIVERED ///////
          it('should return 422 if deleteCustomerById service fails', async () => {
            const req = {
                params: {
                    id: 'customerId',
                },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            getCustomerByIdService.mockResolvedValueOnce({ id: 'customerId' });
        
            await deleteCustomerById(req, res, 'authenticatedUserId', 'admin');
    
            expect(getCustomerByIdService).toHaveBeenCalledWith('customerId');
            expect(deleteCustomerByIdService).toHaveBeenCalledWith('customerId');

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "It would appear that you still have deliveries in progress" });
    
            jest.clearAllMocks();
        });
    });


    ////// UPDATE A CUSTOMER ///////
    describe('PUT updateCustomerById', () => {
        //////// UPDATE CUSTOMER BY ADMIN ///////
        it('should update customer by admin successfully', async () => {
          const req = {
            params: {
              id: 'customerId',
            },
            body: {
                firstname: 'Jean',
                lastname: 'Quartier',
                mail: 'jeanquartier@example.com',
                password: 'securepassword',
                zipCode: '5182',
                address: '5_Chevals_de_la_gallerie',
                town: 'Roiroi'
            },
          };

          const hashedPassword = '$2a$10$SomeHashedPassword';
    
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
          };
    
          getCustomerByIdService.mockResolvedValueOnce({ id: 'customerId' });
          updateCustomerByAdminService.mockResolvedValueOnce(true);
    
          await updateCustomerById(req, res, 'adminUserId', 'admin');
    
          expect(getCustomerByIdService).toHaveBeenCalledWith('customerId');
          expect(updateCustomerByAdminService).toHaveBeenCalledWith(
            'customerId',
            'Jean',
            'Quartier',
            'jeanquartier@example.com',
            hashedPassword,
            '5182',
            '5_Chevals_de_la_gallerie',
            'Roiroi'
          );
          expect(res.status).toHaveBeenCalledWith(204);
          expect(res.send).toHaveBeenCalled();

          jest.clearAllMocks();

        });

        //////// UPDATE CUSTOMER BY CUSTOMER SAME ID///////
        it('should update customer by customer successfully', async () => {
          const req = {
            params: {
              id: 'customerId',
            },
            body: {
              mail: 'Newmail@example.com',
              password: 'Newpassword',
              zipCode: 'NewzipCode',
              address: 'Newaddress',
              town: 'Newtown'
            },
          };

          const hashedPassword = '$2a$10$SomeHashedPassword';
    
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
          };
    
          getCustomerByIdService.mockResolvedValueOnce({ id: 'customerId' });
          updateCustomerByCustomerService.mockResolvedValueOnce(true);
    
          await updateCustomerById(req, res, 'customerId', 'customer');
    
          expect(getCustomerByIdService).toHaveBeenCalledWith('customerId');
          expect(updateCustomerByCustomerService).toHaveBeenCalledWith('customerId', 'Newmail@example.com', hashedPassword, 'NewzipCode','Newaddress','Newtown');

          expect(res.status).toHaveBeenCalledWith(204);
          expect(res.send).toHaveBeenCalled();

          jest.clearAllMocks();

        });
    
        //////// FAILED UPDATE IF CUSTOMER DONT EXIST ///////
        it('should return 404 if customer does not exist', async () => {
          const req = {
            params: {
              id: 'CustomerIdNotFound',
            },
            body: {
                mail: 'Newmail@example.com',
                password: 'Newpassword',
                zipCode: 'NewzipCode',
                address: 'Newaddress',
                town: 'Newtown'
            },
          };
        
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
          };
        
          // Mock the getCustomerByIdService to return null (customer not found)
          getCustomerByIdService.mockResolvedValueOnce(null);
        
          // Call the controller function
          await updateCustomerById(req, res, 'authenticatedUserId', 'customer');
        
          // Assertions
          expect(getCustomerByIdService).toHaveBeenCalledWith('CustomerIdNotFound');
          expect(updateCustomerByAdminService).not.toHaveBeenCalled();
        
          // Check for 404 status
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ success: false, message: "This customer doesn't exist" });
        
          // Reset mocks
          jest.clearAllMocks();
        });

        //////// ACCESS DENIED TO UPDATE IF CUSTOMER ID DONT MATCH///////
        it('should return 401 if access is forbidden', async () => {
          // Mock data for the request
          const req = {
            params: {
              id: 'customerId',
            },
            body: {
                mail: 'Newmail@example.com',
                password: 'Newpassword',
                zipCode: 'NewzipCode',
                address: 'Newaddress',
                town: 'Newtown'
            },
          };
          
          // Mock data for the response
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
          };
          
          // Mock the getCustomerById service to return null (customer not found)
          getCustomerByIdService.mockResolvedValueOnce({ id: 'differentUserId' });
          // Call the controller function
          await updateCustomerById(req, res, 'authenticatedUserId', 'customer');
          
          // Assertions
          expect(getCustomerByIdService).toHaveBeenCalledWith('customerId');
          expect(res.status).toHaveBeenCalledWith(401);
          expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Access forbidden: You cannot modify an account that does not belong to you' });
          
          // Reset mock
          jest.clearAllMocks();
        });
    });   
});
