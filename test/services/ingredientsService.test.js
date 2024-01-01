const ingredientsService = require('../../services/ingredientsService.js');
const db = require('../../models/index.js');

jest.mock('../../models/index.js');

describe('Ingredients Service', () => {
  describe('getIngredients', () => {
    it('should return a list of ingredients', async () => {
      const mockIngredients = [
        { id: 1, name: 'Ingredient1', stock: 10 },
        { id: 2, name: 'Ingredient2', stock: 15 },
      ];

      db.ingredients.findAll.mockResolvedValue(mockIngredients);

      const result = await ingredientsService.getIngredients();

      expect(result).toEqual(mockIngredients);
    });
  });

  describe('addIngredient', () => {
    it('should add a new ingredient', async () => {
      const mockName = 'NewIngredient';
      const mockStock = 20;

      db.ingredients.create.mockResolvedValue({ id: 3, name: mockName, stock: mockStock });

      const result = await ingredientsService.addIngredient(mockName, mockStock);

      expect(result).toEqual({ id: 3, name: mockName, stock: mockStock });
    });
  });

  describe('getIngredientById', () => {
    it('should return an ingredient by its id', async () => {
      const mockIngredientId = 1;
      const mockIngredient = { id: mockIngredientId, name: 'Ingredient1', stock: 10 };

      db.ingredients.findOne.mockResolvedValue(mockIngredient);

      const result = await ingredientsService.getIngredientById(mockIngredientId);

      expect(result).toEqual(mockIngredient);
    });
  });

  describe('deleteIngredientById', () => {
    it('should delete an ingredient by its id', async () => {
      const mockIngredientId = 1;

      db.contain.destroy.mockResolvedValue(1);

      db.ingredients.destroy.mockResolvedValue(1);

      const result = await ingredientsService.deleteIngredientById(mockIngredientId);

      expect(result).toBe(1);
    });
  });

  describe('updateIngredientById', () => {
    it('should update an ingredient by its id', async () => {
      const mockIngredientId = 1;
      const mockName = 'UpdatedIngredient';
      const mockAddStock = 5;

      const mockIngredient = { id: mockIngredientId, name: 'Ingredient1', stock: 10 };

      db.ingredients.findOne.mockResolvedValue(mockIngredient);

      db.ingredients.update.mockResolvedValue([1]);

      const result = await ingredientsService.updateIngredientById(mockIngredientId, mockName, mockAddStock);

      expect(result).toBe(1);
    });
  });
});
