const foodService = require('../../services/foodsService');
const db = require('../../models/index.js');

jest.mock('../../models/index.js');

describe('Food Service', () => {

  describe('getFoods', () => {
    it('should return the list of foods', async () => {
      const mockFoods = [
        { id: 1, name: 'Food 1', price: 10.99, description: 'Description 1', stock: 20 },
        { id: 2, name: 'Food 2', price: 8.99, description: 'Description 2', stock: 15 },
      ];

      db.foods.findAll.mockResolvedValue(mockFoods);

      const result = await foodService.getFoods();

      expect(result).toEqual(mockFoods);
    });
  });

  describe('addFood', () => {
    it('should add a new food', async () => {
      const mockName = 'New Food';
      const mockPrice = 12.99;
      const mockDescription = 'New Description';
      const mockStock = 25;

      db.foods.create.mockResolvedValue({
        id: 3,
        name: mockName,
        price: mockPrice,
        description: mockDescription,
        stock: mockStock,
      });

      const result = await foodService.addFood(mockName, mockPrice, mockDescription, mockStock);

      expect(result).toEqual({
        id: 3,
        name: mockName,
        price: mockPrice,
        description: mockDescription,
        stock: mockStock,
      });
    });
  });

  describe('getFoodById', () => {
    it('should return a food by its id', async () => {
      const mockFoodId = 1;
      const mockFood = { id: mockFoodId, name: 'Food 1', price: 10.99, description: 'Description 1', stock: 20 };

      db.foods.findOne.mockResolvedValue(mockFood);

      const result = await foodService.getFoodById(mockFoodId);

      expect(result).toEqual(mockFood);
    });
  });

  describe('deleteFoodById', () => {
    it('should delete a food by its id when no delivery is in progress', async () => {
      const mockFoodId = 1;

      db.buy.findOne.mockResolvedValue(null);

      db.buy.update.mockResolvedValue(1);

      db.buy.destroy.mockResolvedValue(1);
      db.contain.destroy.mockResolvedValue(1);
      db.buy.update.mockResolvedValue(1);
      db.foods.destroy.mockResolvedValue(1);

      const result = await foodService.deleteFoodById(mockFoodId);

      expect(db.buy.destroy).toHaveBeenCalledWith({ where: { foodId: mockFoodId, status: 'cart' } });
      expect(db.contain.destroy).toHaveBeenCalledWith({ where: { foodId: mockFoodId } });
      expect(db.buy.update).toHaveBeenCalledWith({ foodId: null }, { where: { foodId: mockFoodId } });
      expect(db.foods.destroy).toHaveBeenCalledWith({ where: { id: mockFoodId } });

      expect(result).toBe(1);
    });

    it('should return false when there is a delivery in progress', async () => {
      const mockFoodId = 1;

      db.buy.findOne.mockResolvedValue({});

      const result = await foodService.deleteFoodById(mockFoodId);

      expect(result).toBe(false);
    });
  });

describe('updateFoodByAdmin', () => {
    it('should update food by admin with valid inputs', async () => {
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockPrice = 15.99;
      const mockDescription = 'Updated Description';
      const mockAddStock = 5;

      const mockFood = { id: mockFoodId, name: 'Original Food', price: 10.99, description: 'Original Description', stock: 20 };
      const mockCompositions = [{ ingredientId: 1 }, { ingredientId: 2 }];
      const mockIngredients = [{ id: 1, stock: 10 }, { id: 2, stock: 8 }];

      db.foods.findOne.mockResolvedValue(mockFood);

      db.contain.findAll.mockResolvedValue(mockCompositions);

      db.ingredients.findAll.mockResolvedValue(mockIngredients);

      db.ingredients.update.mockResolvedValue([1, 1]);

      db.foods.update.mockResolvedValue([1]);

      const result = await foodService.updateFoodByAdmin(mockFoodId, mockName, mockPrice, mockDescription, mockAddStock);

      expect(db.ingredients.update).toHaveBeenCalledWith(
        { stock: 5 }, 
        { where: { id: { [db.Sequelize.Op.in]: [1, 2] } } } 
      );

      expect(db.foods.update).toHaveBeenCalledWith(
        {
          name: mockName,
          price: mockPrice,
          description: mockDescription,
          stock: mockFood.stock + mockAddStock, 
        },
        { where: { id: mockFoodId } } 
      );

      expect(result).toEqual([1]);
    });

    it('should return "negStock" when addStock is negative', async () => {
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockPrice = 15.99;
      const mockDescription = 'Updated Description';
      const mockAddStock = -5;

      const result = await foodService.updateFoodByAdmin(mockFoodId, mockName, mockPrice, mockDescription, mockAddStock);

      expect(result).toBe('negStock');
    });

    it('should return "noIngredients" when ingredient stock is insufficient', async () => {
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockPrice = 15.99;
      const mockDescription = 'Updated Description';
      const mockAddStock = 5;

      const mockFood = { id: mockFoodId, name: 'Original Food', price: 10.99, description: 'Original Description', stock: 20 };
      const mockCompositions = [{ ingredientId: 1 }, { ingredientId: 2 }];
      const mockIngredients = [{ id: 1, stock: 3 }, { id: 2, stock: 2 }];

      db.foods.findOne.mockResolvedValue(mockFood);

      db.contain.findAll.mockResolvedValue(mockCompositions);

      db.ingredients.findAll.mockResolvedValue(mockIngredients);

      const result = await foodService.updateFoodByAdmin(mockFoodId, mockName, mockPrice, mockDescription, mockAddStock);

      expect(result).toBe('noIngredients');
    });
  });

  describe('updateFoodByBaker', () => {
    it('should update food by baker with valid inputs', async () => {
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockDescription = 'Updated Description';
      const mockAddStock = 5;

      const mockFood = { id: mockFoodId, name: 'Original Food', price: 10.99, description: 'Original Description', stock: 20 };
      const mockCompositions = [{ ingredientId: 1 }, { ingredientId: 2 }];
      const mockIngredients = [{ id: 1, stock: 10 }, { id: 2, stock: 8 }];

      db.foods.findOne.mockResolvedValue(mockFood);

      db.contain.findAll.mockResolvedValue(mockCompositions);

      db.ingredients.findAll.mockResolvedValue(mockIngredients);

      db.ingredients.update.mockResolvedValue([1, 1]);

      db.foods.update.mockResolvedValue([1]);

      const result = await foodService.updateFoodByBaker(mockFoodId, mockName, mockDescription, mockAddStock);

      expect(db.ingredients.update).toHaveBeenCalledWith(
        { stock: 5 }, 
        { where: { id: { [db.Sequelize.Op.in]: [1, 2] } } } 
      );

      expect(db.foods.update).toHaveBeenCalledWith(
        {
          name: mockName,
          description: mockDescription,
          stock: mockFood.stock + mockAddStock, 
        },
        { where: { id: mockFoodId } } 
      );

      expect(result).toEqual([1]);
    });

    it('should return "negStock" when addStock is negative', async () => {
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockDescription = 'Updated Description';
      const mockAddStock = -5;

      
      const result = await foodService.updateFoodByBaker(mockFoodId, mockName, mockDescription, mockAddStock);

      expect(result).toBe('negStock');
    });

    it('should return "noIngredients" when ingredient stock is insufficient', async () => {
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockDescription = 'Updated Description';
      const mockAddStock = 5;

      const mockFood = { id: mockFoodId, name: 'Original Food', price: 10.99, description: 'Original Description', stock: 20 };
      const mockCompositions = [{ ingredientId: 1 }, { ingredientId: 2 }];
      const mockIngredients = [{ id: 1, stock: 3 }, { id: 2, stock: 2 }];

      db.foods.findOne.mockResolvedValue(mockFood);

      db.contain.findAll.mockResolvedValue(mockCompositions);

      db.ingredients.findAll.mockResolvedValue(mockIngredients);

      const result = await foodService.updateFoodByBaker(mockFoodId, mockName, mockDescription, mockAddStock);

      expect(result).toBe('noIngredients');
    });
  });

  describe('updatePrice', () => {
    it('should update the price of a food', async () => {
      const mockFoodId = 1;
      const mockPrice = 12.99;

      db.foods.update.mockResolvedValue([1]);

      const result = await foodService.updatePrice(mockFoodId, mockPrice);

      expect(db.foods.update).toHaveBeenCalledWith(
        { price: mockPrice }, 
        { where: { id: mockFoodId } } 
      );

      expect(result).toEqual([1]);
    });
  });
});
