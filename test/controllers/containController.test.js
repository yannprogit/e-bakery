///////////////// IMPORT ALL THE FUNCTIONS ////////////////
const {  getCompositions, addContain, getSpecificCompositions, replaceIngredientOfFood, deleteContain} = require('../../controllers/containController.js');
const { getCompositions : getCompositionsService , addContain : addContainService, getSpecificCompositions : getSpecificCompositionsService, replaceIngredientOfFood : replaceIngredientOfFoodService, deleteContain : deleteContainService, getContainByIds : getContainByIdsService} = require('../../services/containService.js');

const { getFoodById :getFoodByIdService  } = require('../../services/foodsService.js');

const { getIngredientById : getIngredientByIdService  } = require('../../services/ingredientsService.js');

///////////////// MOCKING THE SERVICES ////////////////
jest.mock('../../services/containService');
jest.mock('../../services/foodsService');
jest.mock('../../services/ingredientsService');

///////////////// GLOBAL CONTAIN CONTROLLER ////////////////
    /////////////// GET THE LIST OF CUSTOMERS ///////////////
    describe(' Get /contain', () => {
        ///////////////// WHEN IT RETURN THE LIST /////////////////
        it('should get the list of contain', async () => {
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

            expect(res.json).toHaveBeenCalledWith({ success: true, data: listContains });

            jest.clearAllMocks();
        });
    });


    describe('addContain', () => {
        it('should add a new contain - status: 201', async () => {
          const mockFoodId = 1;
          const mockIngredientId = 2;
          const mockContain = { foodId: mockFoodId, ingredientId: mockIngredientId };
      
          getContainByIdsService.mockResolvedValueOnce(null);
      
          getFoodByIdService.mockResolvedValueOnce({ id: mockFoodId, name: 'Pizza', price: 10.99 });
          getIngredientByIdService.mockResolvedValueOnce({ id: mockIngredientId, name: 'Cheese' });
      
          addContainService.mockResolvedValueOnce(mockContain);
      
          const mockReq = {
            body: {
              foodId: mockFoodId,
              ingredientId: mockIngredientId,
            },
          };
      
          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };

          await addContain(mockReq, mockRes);

          expect(getContainByIdsService).toHaveBeenCalledWith(mockFoodId, mockIngredientId);
          expect(getFoodByIdService).toHaveBeenCalledWith(mockFoodId);
          expect(getIngredientByIdService).toHaveBeenCalledWith(mockIngredientId);
          expect(addContainService).toHaveBeenCalledWith(mockFoodId, mockIngredientId);
          expect(mockRes.status).toHaveBeenCalledWith(201);
          expect(mockRes.json).toHaveBeenCalledWith({ success: true, contain: mockContain });
        });
      
        it('should return 422 if the contain already exists', async () => {
          const mockFoodId = 1;
          const mockIngredientId = 2;
      
          getContainByIdsService.mockResolvedValueOnce({ foodId: mockFoodId, ingredientId: mockIngredientId });
      
          const mockReq = {
            body: {
              foodId: mockFoodId,
              ingredientId: mockIngredientId,
            },
          };

          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };

          await addContain(mockReq, mockRes);
 
          expect(getContainByIdsService).toHaveBeenCalledWith(mockFoodId, mockIngredientId);
          expect(mockRes.status).toHaveBeenCalledWith(422);
          expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'This contain already exist' });
        });
      
        it('should return 404 for non-existing food', async () => {
          const mockFoodId = 1;
          const mockIngredientId = 2;
      
          getContainByIdsService.mockResolvedValueOnce(null);
      
          getFoodByIdService.mockResolvedValueOnce(null);
      
          const mockReq = {
            body: {
              foodId: mockFoodId,
              ingredientId: mockIngredientId,
            },
          };

          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          await addContain(mockReq, mockRes);
 
          expect(getContainByIdsService).toHaveBeenCalledWith(mockFoodId, mockIngredientId);
          expect(getFoodByIdService).toHaveBeenCalledWith(mockFoodId);
          expect(mockRes.status).toHaveBeenCalledWith(404);
          expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This food doesn't exist" });
        });
      
        it('should return 404 for non-existing ingredient', async () => {
          const mockFoodId = 1;
          const mockIngredientId = 2;

          getContainByIdsService.mockResolvedValueOnce(null);

          getFoodByIdService.mockResolvedValueOnce({ id: mockFoodId, name: 'Pizza', price: 10.99 });

          getIngredientByIdService.mockResolvedValueOnce(null);
  
          const mockReq = {
            body: {
              foodId: mockFoodId,
              ingredientId: mockIngredientId,
            },
          };

          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };

          await addContain(mockReq, mockRes);
 
          expect(getContainByIdsService).toHaveBeenCalledWith(mockFoodId, mockIngredientId);
          expect(getFoodByIdService).toHaveBeenCalledWith(mockFoodId);
          expect(getIngredientByIdService).toHaveBeenCalledWith(mockIngredientId);
          expect(mockRes.status).toHaveBeenCalledWith(404);
          expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This ingredient doesn't exist" });
        });
      });

  ///////////////// DELETE CONTAIN ////////////////
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
          
            await deleteContain(req, res);
          
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
          

            jest.clearAllMocks();

          });
          
          it('should return 404 if food has no compositions', async () => {
            const foodId = 'exampleFoodId';
          

            getSpecificCompositionsService.mockResolvedValue(null);
          
            const req = {
              params: { foodId },
              query: {} 
            };
          
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn()
            };

            await deleteContain(req, res); 
          
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "This food has no compositions" });
          
            jest.clearAllMocks();
          });


          it('should return 404 if contain does not exist', async () => {
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


  ///////////////// GET SPECIFIC COMPOSITIONS ////////////////
    describe('getSpecificCompositions', () => {
        it('should return compositions based on ids and type', async () => {
            const mockReq = {
                params: {
                    id: 1,
                    type: 'food',
                },
            };
    
            const mockCompositions = [
                { id: 1, foodId: 1, ingredientId: 1 },
                { id: 2, foodId: 1, ingredientId: 2 },
            ];
    
            getSpecificCompositionsService.mockResolvedValue(mockCompositions);
    
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getSpecificCompositions(mockReq, mockRes);
    
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockCompositions });
        });
    
        it('should handle the case where compositions are not found', async () => {
            const mockReq = {
                params: {
                    id: 2,
                    type: 'ingredient',
                },
            };

            getSpecificCompositionsService.mockResolvedValue(null);

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getSpecificCompositions(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "These compositions are impossible to find" });
        });
    });



  ///////////////// UPDATE REPLACE INGREDIENT OF FOOD ////////////////
    describe('replaceIngredientOfFood', () => {
        it('should replace the ingredient of a food', async () => {
            const mockReq = {
                params: {
                    id: 1,
                },
                body: {
                    ingredientId: 2,
                    newIngredientId: 3,
                },
            };
    
            const mockFood = {
                id: 1,
                name: 'Burger',
            };

            const mockContain = {
                id: 1,
                foodId: 1,
                ingredientId: 2,
            };
    
            const mockNonExistingContain = null;

            getFoodByIdService.mockResolvedValue(mockFood);
            getContainByIdsService.mockResolvedValueOnce(mockContain);
            getContainByIdsService.mockResolvedValueOnce(mockNonExistingContain);

            replaceIngredientOfFoodService.mockResolvedValue(true);

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
    
            await replaceIngredientOfFood(mockReq, mockRes);
    
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

    
        it('should handle the case where the food does not exist', async () => {
            const mockReq = {
                params: {
                    id: 2,
                },
                body: {
                    ingredientId: 2,
                    newIngredientId: 3,
                },
            };
    
            getFoodByIdService.mockResolvedValue(null);

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await replaceIngredientOfFood(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This food doesn't exist" });
        });

    
        it('should handle the case where the contain does not exist', async () => {
            const mockReq = {
                params: {
                    id: 1,
                },
                body: {
                    ingredientId: 2,
                    newIngredientId: 3,
                },
            };

            const mockFood = {
                id: 1,
                name: 'Burger',
            };

            const mockNonExistingContain = null;

            getFoodByIdService.mockResolvedValue(mockFood);
            getContainByIdsService.mockResolvedValue(mockNonExistingContain);

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await replaceIngredientOfFood(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This contain doesn't exist" });
        });
    
        
        it('should handle the case where the new contain already exists', async () => {
            const mockReq = {
                params: {
                    id: 1,
                },
                body: {
                    ingredientId: 2,
                    newIngredientId: 3,
                },
            };

            const mockFood = {
                id: 1,
                name: 'Burger',
            };
    
            const mockContain = {
                id: 1,
                foodId: 1,
                ingredientId: 2,
            };

            const mockExistingContain = {
                id: 2,
                foodId: 1,
                ingredientId: 3,
            };

            getFoodByIdService.mockResolvedValue(mockFood);
            getContainByIdsService.mockResolvedValueOnce(mockContain);
            getContainByIdsService.mockResolvedValueOnce(mockExistingContain);

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await replaceIngredientOfFood(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(422);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This contain already exist" });
        });
    });

