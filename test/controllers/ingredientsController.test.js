
const {getIngredients, addIngredient, getIngredientById, deleteIngredientById, updateIngredientById } = require('../../controllers/ingredientsController.js');
const {getIngredients: getIngredientsService, addIngredient: addIngredientService, getIngredientById: getIngredientByIdService, deleteIngredientById: deleteIngredientByIdService, updateIngredientById : updateIngredientByIdService} = require('../../services/ingredientsService.js');
  
  
  jest.mock('../../services/ingredientsService.js');
  
  describe('Ingredients Controller', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('INGREDIENTS', () => {
      describe('getIngredients', () => {
        it('should return a list of ingredients with status 200', async () => {
          // Arrange
          const mockReq = {};
          const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
          // Mock the behavior of getIngredientsService
          const mockIngredientsData = [
            { id: 'ingredientId1', name: 'Ingredient 1' },
            { id: 'ingredientId2', name: 'Ingredient 2' },
          ];
          getIngredientsService.mockResolvedValue(mockIngredientsData);
    
          // Act
          await getIngredients(mockReq, mockRes);
    
          // Assert
          expect(getIngredientsService).toHaveBeenCalled();
          expect(mockRes.status).toHaveBeenCalledWith(200);
          expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockIngredientsData });
        });
      });
    });
    
  
    describe('addIngredient', () => {
      it('should add an ingredient and return it with status 201', async () => {
        // Arrange
        const mockReq = {
          body: {
            name: 'New Ingredient',
            stock: 10,
          },
        };
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Mock the behavior of addIngredientService
        const mockAddedIngredient = { id: 'newIngredientId', name: 'New Ingredient', stock: 10 };
        addIngredientService.mockResolvedValue(mockAddedIngredient);
  
        // Act
        await addIngredient(mockReq, mockRes);
  
        // Assert
        expect(addIngredientService).toHaveBeenCalledWith('New Ingredient', 10);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, ingredient: mockAddedIngredient });
      });
  
      it('should return 400 if stock is not over 0', async () => {
        const mockReq = {
            body: {
                name: 'Salt',
                stock: 0, // Stock is set to 0, which is not allowed
            },
        };
    
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        addIngredientService.mockResolvedValue(null); // Simulate that addIngredient returns null
    
        // Act
        await addIngredient(mockReq, mockRes);
    
        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: "The stock must be over 0",
        });
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


    describe('updateIngredientById', () => {

      it('should return 404 if ingredient does not exist', async () => {
        const mockReq = {
            params: { id: 'ingredientId123' },
        };
    
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        // Mock the behavior of getIngredientById
        getIngredientByIdService.mockResolvedValue(null); // Simulate that getIngredientById returns null
    
        // Act
        await updateIngredientById(mockReq, mockRes);
    
        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: "This ingredient doesn't exist",
        });
    });

    it('should return 400 if the addition of stock is not over 0', async () => {
      const mockReq = {
          params: { id: 'ingredientId123' },
          body: {
              name: 'New Ingredient Name',
              addStock: 0, // Set to a value not over 0 for testing
          },
      };
  
      const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
  
      // Mock the behavior of getIngredientById
      getIngredientByIdService.mockResolvedValue({ id: 'ingredientId123', name: 'Existing Ingredient', stock: 10 });
  
      // Mock the behavior of updateIngredientById to simulate failure
      updateIngredientByIdService.mockResolvedValue(false);
  
      // Act
      await updateIngredientById(mockReq, mockRes);
  
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: "The addition of stock must be over 0",
      });
  });


  it('should return 204 if the ingredient is updated successfully', async () => {
    const mockReq = {
        params: { id: 'ingredientId123' },
        body: {
            name: 'New Ingredient Name',
            addStock: 5, // Set to a valid value for testing
        },
    };

    const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    // Mock the behavior of getIngredientById
    getIngredientByIdService.mockResolvedValue({ id: 'ingredientId123', name: 'Existing Ingredient', stock: 10 });

    // Mock the behavior of updateIngredientById to simulate success
    updateIngredientByIdService.mockResolvedValue(true);

    // Act
    await updateIngredientById(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
});
  
  });
});