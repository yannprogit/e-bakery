// Import the necessary modules and the service you want to test
const ingredientsService = require('../../services/ingredientsService.js');
const db = require('../../models/index.js');

// Mock the database models
jest.mock('../../models/index.js');

describe('Ingredients Service', () => {
  // Test case for getIngredients
  describe('getIngredients', () => {
    it('should return a list of ingredients', async () => {
      // Mock data for testing
      const mockIngredients = [
        { id: 1, name: 'Ingredient1', stock: 10 },
        { id: 2, name: 'Ingredient2', stock: 15 },
      ];

      // Set up mock implementation for findAll method in ingredients
      db.ingredients.findAll.mockResolvedValue(mockIngredients);

      // Call the method
      const result = await ingredientsService.getIngredients();

      // Ensure that the result is as expected
      expect(result).toEqual(mockIngredients);
    });
  });

  // Test case for addIngredient
  describe('addIngredient', () => {
    it('should add a new ingredient', async () => {
      // Mock data for testing
      const mockName = 'NewIngredient';
      const mockStock = 20;

      // Set up mock implementation for create method in ingredients
      db.ingredients.create.mockResolvedValue({ id: 3, name: mockName, stock: mockStock });

      // Call the method
      const result = await ingredientsService.addIngredient(mockName, mockStock);

      // Ensure that the result is as expected
      expect(result).toEqual({ id: 3, name: mockName, stock: mockStock });
    });
  });

  // Test case for getIngredientById
  describe('getIngredientById', () => {
    it('should return an ingredient by its id', async () => {
      // Mock data for testing
      const mockIngredientId = 1;
      const mockIngredient = { id: mockIngredientId, name: 'Ingredient1', stock: 10 };

      // Set up mock implementation for findOne method in ingredients
      db.ingredients.findOne.mockResolvedValue(mockIngredient);

      // Call the method
      const result = await ingredientsService.getIngredientById(mockIngredientId);

      // Ensure that the result is as expected
      expect(result).toEqual(mockIngredient);
    });
  });

  // Test case for deleteIngredientById
  describe('deleteIngredientById', () => {
    it('should delete an ingredient by its id', async () => {
      // Mock data for testing
      const mockIngredientId = 1;

      // Set up mock implementation for destroy method in contain
      db.contain.destroy.mockResolvedValue(1);

      // Set up mock implementation for destroy method in ingredients
      db.ingredients.destroy.mockResolvedValue(1);

      // Call the method
      const result = await ingredientsService.deleteIngredientById(mockIngredientId);

      // Ensure that the result is as expected
      expect(result).toBe(1);
    });
  });

  // Test case for updateIngredientById
  describe('updateIngredientById', () => {
    it('should update an ingredient by its id', async () => {
      // Mock data for testing
      const mockIngredientId = 1;
      const mockName = 'UpdatedIngredient';
      const mockAddStock = 5;

      const mockIngredient = { id: mockIngredientId, name: 'Ingredient1', stock: 10 };

      // Set up mock implementation for findOne method in ingredients
      db.ingredients.findOne.mockResolvedValue(mockIngredient);

      // Set up mock implementation for update method in ingredients
      db.ingredients.update.mockResolvedValue([1]);

      // Call the method
      const result = await ingredientsService.updateIngredientById(mockIngredientId, mockName, mockAddStock);

      // Ensure that the result is as expected
      expect(result).toBe(1);
    });
  });
});
