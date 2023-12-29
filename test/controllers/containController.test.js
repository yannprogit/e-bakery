// Import required modules and the controller (functions)
const {  getCompositions, addContain, getSpecificCompositions, replaceIngredientOfFood, deleteContain, getContainByIds} = require('../../controllers/containController.js');
const { getCompositions : getCompositionsService , addContain : addContainService, getSpecificCompositions : getSpecificCompositionsService, replaceIngredientOfFood : replaceIngredientOfFoodService, deleteContain : deleteContainService, getContainByIds : getContainByIdsService} = require('../../services/containService.js');

const { getFoodById } = require('../../controllers/foodsController.js');
const { getFoodById :getFoodByIdService  } = require('../../services/foodsService.js');

const { getIngredientById } = require('../../controllers/ingredientsController.js');
const { getIngredientById : getIngredientByIdService  } = require('../../services/ingredientsService.js');

// Mocking the services
jest.mock('../../services/containService');
jest.mock('../../services/foodsService');
jest.mock('../../services/ingredientsService');

    /////////////// GET THE LIST OF CUSTOMERS ///////////////
    describe(' Get /contain', () => {
        ///////////////// WHEN IT RETURN THE LIST /////////////////
        it('should get the list of contain', async () => {
            // Mock of the data of the customer in the database
            const listContains = [
                { foodId : 1, ingredientId : 1},
                { foodId : 1, ingredientId : 2}
            ];

            getCompositionsService.mockResolvedValue(listContains);

            const req = {};
            const res= {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getCompositions({}, res);

            /*expect(res.status).toHaveBeenCalledWith(200);*/
            expect(res.json).toHaveBeenCalledWith({ success: true, data: listContains });

            // Reset mock
            jest.clearAllMocks();
        });
    });


    describe('addContain', () => {
        it('should add a new contain - status: 201', async () => {
          // Arrange
          const mockFoodId = 1;
          const mockIngredientId = 2;
          const mockContain = { foodId: mockFoodId, ingredientId: mockIngredientId };
      
          // Mock the getContainByIds function to return null (indicating that the contain doesn't exist)
          getContainByIdsService.mockResolvedValueOnce(null);
      
          // Mock the getFoodById and getIngredientById functions to return valid data
          getFoodByIdService.mockResolvedValueOnce({ id: mockFoodId, name: 'Pizza', price: 10.99 });
          getIngredientByIdService.mockResolvedValueOnce({ id: mockIngredientId, name: 'Cheese' });
      
          // Mock the addContainService function to return the mockContain
          addContainService.mockResolvedValueOnce(mockContain);
      
          // Mock the request object
          const mockReq = {
            body: {
              foodId: mockFoodId,
              ingredientId: mockIngredientId,
            },
          };
      
          // Mock the response object
          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Act
          await addContain(mockReq, mockRes);
      
          // Assert
          expect(getContainByIdsService).toHaveBeenCalledWith(mockFoodId, mockIngredientId);
          expect(getFoodByIdService).toHaveBeenCalledWith(mockFoodId);
          expect(getIngredientByIdService).toHaveBeenCalledWith(mockIngredientId);
          expect(addContainService).toHaveBeenCalledWith(mockFoodId, mockIngredientId);
          expect(mockRes.status).toHaveBeenCalledWith(201);
          expect(mockRes.json).toHaveBeenCalledWith({ success: true, contain: mockContain });
        });
      
        it('should return 422 if the contain already exists', async () => {
          // Arrange
          const mockFoodId = 1;
          const mockIngredientId = 2;
      
          // Mock the getContainByIds function to return an existing contain
          getContainByIdsService.mockResolvedValueOnce({ foodId: mockFoodId, ingredientId: mockIngredientId });
      
          // Mock the request object
          const mockReq = {
            body: {
              foodId: mockFoodId,
              ingredientId: mockIngredientId,
            },
          };
      
          // Mock the response object
          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Act
          await addContain(mockReq, mockRes);
      
          // Assert
          expect(getContainByIdsService).toHaveBeenCalledWith(mockFoodId, mockIngredientId);
          expect(mockRes.status).toHaveBeenCalledWith(422);
          expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'This contain already exist' });
        });
      
        it('should return 404 for non-existing food', async () => {
          // Arrange
          const mockFoodId = 1;
          const mockIngredientId = 2;
      
          // Mock the getContainByIds function to return null (indicating that the contain doesn't exist)
          getContainByIdsService.mockResolvedValueOnce(null);
      
          // Mock the getFoodById function to return null (indicating that the food doesn't exist)
          getFoodByIdService.mockResolvedValueOnce(null);
      
          // Mock the request object
          const mockReq = {
            body: {
              foodId: mockFoodId,
              ingredientId: mockIngredientId,
            },
          };
      
          // Mock the response object
          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Act
          await addContain(mockReq, mockRes);
      
          // Assert
          expect(getContainByIdsService).toHaveBeenCalledWith(mockFoodId, mockIngredientId);
          expect(getFoodByIdService).toHaveBeenCalledWith(mockFoodId);
          expect(mockRes.status).toHaveBeenCalledWith(404);
          expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This food doesn't exist" });
        });
      
        it('should return 404 for non-existing ingredient', async () => {
          // Arrange
          const mockFoodId = 1;
          const mockIngredientId = 2;
      
          // Mock the getContainByIds function to return null (indicating that the contain doesn't exist)
          getContainByIdsService.mockResolvedValueOnce(null);
      
          // Mock the getFoodById function to return valid data
          getFoodByIdService.mockResolvedValueOnce({ id: mockFoodId, name: 'Pizza', price: 10.99 });
      
          // Mock the getIngredientById function to return null (indicating that the ingredient doesn't exist)
          getIngredientByIdService.mockResolvedValueOnce(null);
      
          // Mock the request object
          const mockReq = {
            body: {
              foodId: mockFoodId,
              ingredientId: mockIngredientId,
            },
          };
      
          // Mock the response object
          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Act
          await addContain(mockReq, mockRes);
      
          // Assert
          expect(getContainByIdsService).toHaveBeenCalledWith(mockFoodId, mockIngredientId);
          expect(getFoodByIdService).toHaveBeenCalledWith(mockFoodId);
          expect(getIngredientByIdService).toHaveBeenCalledWith(mockIngredientId);
          expect(mockRes.status).toHaveBeenCalledWith(404);
          expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This ingredient doesn't exist" });
        });
      });

    describe('Contain Controller - Delete Contain', () => {
        it('should delete compositions of a food when ingredientId is not provided', async () => {
            const compositions = [{ foodId: 1, ingredientId: 1 }];
          
            getSpecificCompositionsService.mockResolvedValue(compositions);
          
            const req = {
              params: {
                id: 1,
              },
              query: {
                ingredientId: null,
              },
            };
          
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
              send: jest.fn(),
            };
          
            // Call the function
            await deleteContain(req, res);
          
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
          
            // Reset mock
            jest.clearAllMocks();

          });
          
          it('should return 404 if food has no compositions', async () => {
            // Mock data
            const foodId = 'exampleFoodId';
          
            // Mocking the service function
            getSpecificCompositionsService.mockResolvedValue(null);
          
            // Mock Express request and response objects
            const req = {
              params: { foodId },
              query: {} // Empty query to simulate missing ingredientId
            };
          
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn()
            };
          
            // Call the function
            await deleteContain(req, res); // Replace 'yourFunctionName' with the actual function name
          
            // Assertions
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "This food has no compositions" });
          
            // Reset mock
            jest.clearAllMocks();
          });


          it('should return 404 if contain does not exist', async () => {
            // Mock data
            const foodId = 1;
            const ingredientId = 1;

            const Contain = {foodId : 1, ingredientId : 1};

            getSpecificCompositionsService.mockResolvedValue(Contain);
            getContainByIdsService.mockResolvedValue(null);
          
            const req = {
              params: { foodId },
              query: { ingredientId }
            };
          
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn()
            };
          
            await deleteContain(req, res);
          
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "This contain doesn't exist" });
          
            // Reset mock
            jest.clearAllMocks();
          });
          
          it('should delete contain if it exists', async () => {
            const foodId = 'exampleFoodId';
            const ingredientId = 'existingIngredientId';
            const Contain = { foodId : 1, ingredientId : 1};

            getSpecificCompositionsService.mockResolvedValue(Contain);
            getContainByIdsService.mockResolvedValue({ Contain });
          
            const req = {
              params: { foodId },
              query: { ingredientId }
            };
          
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
              send: jest.fn()
            };
          

            await deleteContain(req, res);
          
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
          
            jest.clearAllMocks();
          });

      });



    describe('getSpecificCompositions', () => {
        it('should return compositions based on ids and type', async () => {
            // Mock data for the request parameters
            const mockReq = {
                params: {
                    id: 1,
                    type: 'food',
                },
            };
    
            // Mock data for the expected response
            const mockCompositions = [
                { id: 1, foodId: 1, ingredientId: 1 },
                { id: 2, foodId: 1, ingredientId: 2 },
            ];
    
            // Mock the behavior of the getSpecificCompositions service
            getSpecificCompositionsService.mockResolvedValue(mockCompositions);
    
            // Mock Express response object
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Call the getSpecificCompositions method
            await getSpecificCompositions(mockReq, mockRes);
    
            // Verify that the response is as expected
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockCompositions });
        });
    
        it('should handle the case where compositions are not found', async () => {
            // Mock data for the request parameters
            const mockReq = {
                params: {
                    id: 2,
                    type: 'ingredient',
                },
            };
    
            // Mock the behavior of the getSpecificCompositions service when compositions are not found
            getSpecificCompositionsService.mockResolvedValue(null);
    
            // Mock Express response object
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Call the getSpecificCompositions method
            await getSpecificCompositions(mockReq, mockRes);
    
            // Verify that the response is as expected
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "These compositions are impossible to find" });
        });
    });




    describe('replaceIngredientOfFood', () => {
        it('should replace the ingredient of a food', async () => {
            // Mock data for the request parameters
            const mockReq = {
                params: {
                    id: 1,
                },
                body: {
                    ingredientId: 2,
                    newIngredientId: 3,
                },
            };
    
            // Mock data for the existing food
            const mockFood = {
                id: 1,
                name: 'Burger',
                // Add other properties as needed
            };
    
            // Mock data for the existing contain
            const mockContain = {
                id: 1,
                foodId: 1,
                ingredientId: 2,
            };
    
            // Mock data for the non-existing contain with the new ingredient
            const mockNonExistingContain = null;
    
            // Mock the behavior of getFoodById and getContainByIds services
            getFoodByIdService.mockResolvedValue(mockFood);
            getContainByIdsService.mockResolvedValueOnce(mockContain);
            getContainByIdsService.mockResolvedValueOnce(mockNonExistingContain);
    
            // Mock the behavior of replaceIngredientOfFood service
            replaceIngredientOfFoodService.mockResolvedValue(true);
    
            // Mock Express response object
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            // Call the replaceIngredientOfFood method
            await replaceIngredientOfFood(mockReq, mockRes);
    
            // Verify that the response is as expected
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

    
        it('should handle the case where the food does not exist', async () => {
            // Mock data for the request parameters
            const mockReq = {
                params: {
                    id: 2,
                },
                body: {
                    ingredientId: 2,
                    newIngredientId: 3,
                },
            };
    
            // Mock the behavior of getFoodById service when the food does not exist
            getFoodByIdService.mockResolvedValue(null);
    
            // Mock Express response object
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Call the replaceIngredientOfFood method
            await replaceIngredientOfFood(mockReq, mockRes);
    
            // Verify that the response is as expected
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This food doesn't exist" });
        });

    
        it('should handle the case where the contain does not exist', async () => {
            // Mock data for the request parameters
            const mockReq = {
                params: {
                    id: 1,
                },
                body: {
                    ingredientId: 2,
                    newIngredientId: 3,
                },
            };
    
            // Mock data for the existing food
            const mockFood = {
                id: 1,
                name: 'Burger',
                // Add other properties as needed
            };
    
            // Mock data for the non-existing contain
            const mockNonExistingContain = null;
    
            // Mock the behavior of getFoodById and getContainByIds services
            getFoodByIdService.mockResolvedValue(mockFood);
            getContainByIdsService.mockResolvedValue(mockNonExistingContain);
    
            // Mock Express response object
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Call the replaceIngredientOfFood method
            await replaceIngredientOfFood(mockReq, mockRes);
    
            // Verify that the response is as expected
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This contain doesn't exist" });
        });
    
        
        it('should handle the case where the new contain already exists', async () => {
            // Mock data for the request parameters
            const mockReq = {
                params: {
                    id: 1,
                },
                body: {
                    ingredientId: 2,
                    newIngredientId: 3,
                },
            };
    
            // Mock data for the existing food
            const mockFood = {
                id: 1,
                name: 'Burger',
                // Add other properties as needed
            };
    
            // Mock data for the existing contain
            const mockContain = {
                id: 1,
                foodId: 1,
                ingredientId: 2,
            };
    
            // Mock data for the existing contain with the new ingredient
            const mockExistingContain = {
                id: 2,
                foodId: 1,
                ingredientId: 3,
            };
    
            // Mock the behavior of getFoodById and getContainByIds services
            getFoodByIdService.mockResolvedValue(mockFood);
            getContainByIdsService.mockResolvedValueOnce(mockContain);
            getContainByIdsService.mockResolvedValueOnce(mockExistingContain);
    
            // Mock Express response object
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Call the replaceIngredientOfFood method
            await replaceIngredientOfFood(mockReq, mockRes);
    
            // Verify that the response is as expected
            expect(mockRes.status).toHaveBeenCalledWith(422);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This contain already exist" });
        });
    });

