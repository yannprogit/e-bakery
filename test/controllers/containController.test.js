// Import required modules and the controller (functions)
const {  getCompositions, addContain, getSpecificCompositions, replaceIngredientOfFood, deleteContain, getContainByIds} = require('../../controllers/containController.js');
const { getFoodById } = require('../../controllers/foodsController.js');
const { getFoodById :getFoodByIdService  } = require('../../services/foodsService.js');
const { getCompositions : getCompositionsService , addContain : addContainService, getSpecificCompositions : getSpecificCompositionsService, replaceIngredientOfFood : replaceIngredientOfFoodService, deleteContain : deleteContainService, getContainByIds : getContainByIdsService} = require('../../services/containService.js');

// Mocking the services
jest.mock('../../services/containService');
jest.mock('../../services/foodsService');
jest.mock('bcrypt');

///////////////// GLOBAL CONTAIN ////////////////
describe('Contain Controller', () => {

    /////////////// GET THE LIST OF CUSTOMERS ///////////////
    describe(' Get /contain', () => {
        ///////////////// WHEN IT RETURN THE LIST /////////////////
        it('should get the list of contain', async () => {
            // Mock of the data of the customer in the database
            const listContains = [
                { id: 1, foodId : 1, ingredientId : 1},
                { id : 2, foodId : 1, ingredientId : 2}
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


    describe('Contain Controller - Delete Contain', () => {
        it('should delete a contain with a 204 status code', async () => {
          // Mock data for the request
          const mockReq = {
            body: {
              foodId: 1,
              ingredientId: 2,
            },
          };
      
          // Mock data for the response
          const mockContain = { foodId: 1, ingredientId: 2, quantity: 10 };
      
          // Mock the behavior of the getContainByIds function
          getContainByIdsService.mockResolvedValue(mockContain);
      
          // Mock the behavior of the deleteContainService function
          deleteContainService.mockImplementation(() => {});
      
          // Mock Express response object
          const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
          };
      
          // Call the deleteContain method
          await deleteContain(mockReq, mockRes);
      
          // Verify that the response status and method are as expected
          expect(mockRes.status).toHaveBeenCalledWith(204);
          expect(mockRes.send).toHaveBeenCalled();
        });
      
        it('should handle error when contain does not exist', async () => {
          // Mock data for the request
          const mockReq = {
            body: {
              foodId: 1,
              ingredientId: 2,
            },
          };
      
          // Mock the behavior of the getContainByIds function when contain does not exist
          getContainByIdsService.mockResolvedValue(null);
      
          // Mock Express response object
          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Call the deleteContain method
          await deleteContain(mockReq, mockRes);
      
          // Verify that the response status and JSON are as expected for an error
          expect(mockRes.status).toHaveBeenCalledWith(404);
          expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This contain doesn't exist" });
        });
      });

    ///////////////////// ADD CONTAIN ///////////////////////
    describe('addContain', () => {
        it('should add a new contain', async () => {
            const req = {
              body: {
                foodId: 1,
                ingredientId: 2
              }
            };
        
            const ExistingContain = null;
        
            const NewContain = {
              id: 3,
              foodId: 1,
              ingredientId: 2
            };
        
            getContainByIdsService.mockResolvedValue(ExistingContain);
            addContainService.mockResolvedValue(NewContain);
        
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
            };
        
            console.log('req:', req);
            console.log('res:', res);
        
            await addContain(req, res);
                
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, contain: NewContain });
          });


          it('should handle the case where the contain already exists', async () => {
            const mockReq = {
                body: {
                    foodId: 1,
                    ingredientId: 2
                }
            };

            const mockExistingContain = {
                id: 1,
                foodId: 1,
                ingredientId: 2
            };

            // Mock the behavior of getContainByIds service
            getContainByIdsService.mockResolvedValue(mockExistingContain);

            // Mock Express response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            console.log('res before calling addContain:', res);

            // Call the addContain method
            const addContainPromise = addContain(mockReq, res);

            // Advance timers to allow asynchronous operations to complete
            jest.advanceTimersByTime(0);

            await addContainPromise;

            console.log('res after calling addContain:', res);

            // Verify that the response is as expected
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "This contain already exist" });
        });

        it('should handle the case where adding the contain fails', async () => {
            // Mock data for the request
            const mockReq = {
                body: {
                    foodId: 1,
                    ingredientId: 2
                }
            };

            // Mock data for the existing contain (to simulate it doesn't exist)
            const mockExistingContain = null;

            // Mock the behavior of getContainByIds service
            getContainByIdsService.mockResolvedValue(mockExistingContain);

            // Mock the behavior of addContain service (to simulate an error)
            addContainService.mockResolvedValue(null);

            // Mock Express response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Call the addContain method
            await addContain(mockReq, res);

            // Verify that the response is as expected
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error when creating this contain, verify your args" });
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
    
        it('should handle the case where updating the ingredient fails', async () => {
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
            const mockNonExistingContain = null;
    
            // Mock the behavior of getFoodById, getContainByIds, and replaceIngredientOfFood services
            getFoodByIdService.mockResolvedValue(mockFood);
            getContainByIdsService.mockResolvedValueOnce(mockContain);
            getContainByIdsService.mockResolvedValueOnce(mockNonExistingContain);
            replaceIngredientOfFoodService.mockResolvedValue(false);
    
            // Mock Express response object
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Call the replaceIngredientOfFood method
            await replaceIngredientOfFood(mockReq, mockRes);
    
            // Verify that the response is as expected
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "Error when updating this ingredient, verify your args" });
        });
    });
});
