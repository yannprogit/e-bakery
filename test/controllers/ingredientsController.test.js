
const {getIngredients, addIngredient, getIngredientById, deleteIngredientById} = require('../../controllers/ingredientsController.js');
const {getIngredients: getIngredientsService, addIngredient: addIngredientService, getIngredientById: getIngredientByIdService, deleteIngredientById: deleteIngredientByIdService} = require('../../services/ingredientsService.js');
  
  
  jest.mock('../../services/ingredientsService.js');
  
  describe('Ingredients Controller', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('INGREDIENTS', () => {
        describe('Ingredients Controller - Get Ingredients', () => {
            it('should return a list of ingredients with a 200 status code', async () => {
              // Mock data for the ingredients
              const mockIngredients = [
                { id: 1, name: 'Salt', description: 'Common table salt' },
                { id: 2, name: 'Sugar', description: 'Granulated sugar' },
              ];
          
              // Mock the behavior of the getIngredientsService function
              getIngredientsService.mockResolvedValue(mockIngredients);
          
              // Mock Express response object
              const mockRes = {
                json: jest.fn(),
              };
          
              // Call the getIngredients method
              await getIngredients({}, mockRes);
          
              // Verify that the response JSON and status are as expected
              expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockIngredients });
            });
          });
    });
  
    describe('addIngredient', () => {
      it('should add an ingredient and return 201 status', async () => {
        const req = {
          body: {
            name: 'NewIngredient',
            stock: 20
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        const mockIngredient = {
          id: 3,
          name: 'NewIngredient',
          stock: 20
        };
  
        addIngredientService.mockResolvedValue(mockIngredient);
  
        await addIngredient(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ success: true, ingredient: mockIngredient });
      });
  
      it('should return 404 status when there is an error creating the ingredient', async () => {
        const req = {
          body: {
            name: 'InvalidIngredient',
            stock: 30
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        addIngredientService.mockResolvedValue(null);
  
        await addIngredient(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error when creating this ingredient, verify your args' });
      });
    });
  
    describe('getIngredientById', () => {
      it('should return an ingredient by ID', async () => {
        const req = {
          params: {
            id: 1
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        const mockIngredient = { id: 1, name: 'Ingredient1', stock: 10 };
  
        getIngredientByIdService.mockResolvedValue(mockIngredient);
  
        await getIngredientById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: mockIngredient });
      });
  
      it('should return 404 status when ingredient does not exist', async () => {
        const req = {
          params: {
            id: 999
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        getIngredientByIdService.mockResolvedValue(null);
  
        await getIngredientById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "This ingredient doesn't exist" });
      });
    });
  
    describe('deleteIngredientById', () => {
      it('should delete an ingredient by ID and return 204 status', async () => {
        const req = {
          params: {
            id: 1
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          send: jest.fn()
        };
  
        getIngredientByIdService.mockResolvedValue({ id: 1, name: 'Ingredient1', stock: 10 });
  
        await deleteIngredientById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
      });
  
      it('should return 404 status when trying to delete a non-existing ingredient', async () => {
        const req = {
          params: {
            id: 999
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        getIngredientByIdService.mockResolvedValue(null);
  
        await deleteIngredientById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "This ingredient doesn't exist" });
      });
    });
  });