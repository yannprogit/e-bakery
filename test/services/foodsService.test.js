//------------- Import -------------
const foodService = require('../../services/foodsService');
const db = require('../../models/index.js');

// Mock the database models
jest.mock('../../models/index.js');

describe('Food Service', () => {
  // Test case for getFoods
  describe('getFoods', () => {
    it('should return the list of foods', async () => {
      // Arrange
      const mockFoods = [
        { id: 1, name: 'Food 1', price: 10.99, description: 'Description 1', stock: 20 },
        { id: 2, name: 'Food 2', price: 8.99, description: 'Description 2', stock: 15 },
      ];

      // Set up mock implementation for findAll method in foods
      db.foods.findAll.mockResolvedValue(mockFoods);

      // Act
      const result = await foodService.getFoods();

      // Assert
      // Ensure that the result is as expected
      expect(result).toEqual(mockFoods);
    });
  });

  // Test case for addFood
  describe('addFood', () => {
    it('should add a new food', async () => {
      // Arrange
      const mockName = 'New Food';
      const mockPrice = 12.99;
      const mockDescription = 'New Description';
      const mockStock = 25;

      // Set up mock implementation for create method in foods
      db.foods.create.mockResolvedValue({
        id: 3,
        name: mockName,
        price: mockPrice,
        description: mockDescription,
        stock: mockStock,
      });

      // Act
      const result = await foodService.addFood(mockName, mockPrice, mockDescription, mockStock);

      // Assert
      // Ensure that the result is as expected
      expect(result).toEqual({
        id: 3,
        name: mockName,
        price: mockPrice,
        description: mockDescription,
        stock: mockStock,
      });
    });
  });

  // Test case for getFoodById
  describe('getFoodById', () => {
    it('should return a food by its id', async () => {
      // Arrange
      const mockFoodId = 1;
      const mockFood = { id: mockFoodId, name: 'Food 1', price: 10.99, description: 'Description 1', stock: 20 };

      // Set up mock implementation for findOne method in foods
      db.foods.findOne.mockResolvedValue(mockFood);

      // Act
      const result = await foodService.getFoodById(mockFoodId);

      // Assert
      // Ensure that the result is as expected
      expect(result).toEqual(mockFood);
    });
  });

  // Test case for deleteFoodById
  describe('deleteFoodById', () => {
    it('should delete a food by its id when no delivery is in progress', async () => {
      // Arrange
      const mockFoodId = 1;

      // Set up mock implementation for findOne method in buy
      db.buy.findOne.mockResolvedValue(null);

      // Set up mock implementation for update method in buy
      db.buy.update.mockResolvedValue(1);

      // Set up mock implementation for destroy methods
      db.buy.destroy.mockResolvedValue(1);
      db.contain.destroy.mockResolvedValue(1);
      db.buy.update.mockResolvedValue(1);
      db.foods.destroy.mockResolvedValue(1);

      // Act
      const result = await foodService.deleteFoodById(mockFoodId);

      // Assert
      // Check if the destroy methods were called with the expected parameters
      expect(db.buy.destroy).toHaveBeenCalledWith({ where: { foodId: mockFoodId, status: 'cart' } });
      expect(db.contain.destroy).toHaveBeenCalledWith({ where: { foodId: mockFoodId } });
      expect(db.buy.update).toHaveBeenCalledWith({ foodId: null }, { where: { foodId: mockFoodId } });
      expect(db.foods.destroy).toHaveBeenCalledWith({ where: { id: mockFoodId } });

      // Ensure that the result is as expected
      expect(result).toBe(1);
    });

    it('should return false when there is a delivery in progress', async () => {
      // Arrange
      const mockFoodId = 1;

      // Set up mock implementation for findOne method in buy
      db.buy.findOne.mockResolvedValue({});

      // Act
      const result = await foodService.deleteFoodById(mockFoodId);

      // Assert
      // Ensure that the result is as expected
      expect(result).toBe(false);
    });
  });

// Test case for updateFoodByAdmin
describe('updateFoodByAdmin', () => {
    it('should update food by admin with valid inputs', async () => {
      // Arrange
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockPrice = 15.99;
      const mockDescription = 'Updated Description';
      const mockAddStock = 5;

      const mockFood = { id: mockFoodId, name: 'Original Food', price: 10.99, description: 'Original Description', stock: 20 };
      const mockCompositions = [{ ingredientId: 1 }, { ingredientId: 2 }];
      const mockIngredients = [{ id: 1, stock: 10 }, { id: 2, stock: 8 }];

      // Set up mock implementation for findOne method in foods
      db.foods.findOne.mockResolvedValue(mockFood);

      // Set up mock implementation for findAll method in contain
      db.contain.findAll.mockResolvedValue(mockCompositions);

      // Set up mock implementation for findAll method in ingredients
      db.ingredients.findAll.mockResolvedValue(mockIngredients);

      // Set up mock implementation for update method in ingredients
      db.ingredients.update.mockResolvedValue([1, 1]);

      // Set up mock implementation for update method in foods
      db.foods.update.mockResolvedValue([1]);

      // Act
      const result = await foodService.updateFoodByAdmin(mockFoodId, mockName, mockPrice, mockDescription, mockAddStock);

      // Assert
      // Check if the update methods were called with the expected parameters
      expect(db.ingredients.update).toHaveBeenCalledWith(
        { stock: 5 }, // New stock value for ingredients
        { where: { id: { [db.Sequelize.Op.in]: [1, 2] } } } // Condition for updating ingredients
      );

      expect(db.foods.update).toHaveBeenCalledWith(
        {
          name: mockName,
          price: mockPrice,
          description: mockDescription,
          stock: mockFood.stock + mockAddStock, // New stock value for food
        },
        { where: { id: mockFoodId } } // Condition for updating food
      );

      // Ensure that the result is as expected
      expect(result).toEqual([1]);
    });

    it('should return "negStock" when addStock is negative', async () => {
      // Arrange
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockPrice = 15.99;
      const mockDescription = 'Updated Description';
      const mockAddStock = -5;

      // Act
      const result = await foodService.updateFoodByAdmin(mockFoodId, mockName, mockPrice, mockDescription, mockAddStock);

      // Assert
      // Ensure that the result is as expected
      expect(result).toBe('negStock');
    });

    it('should return "noIngredients" when ingredient stock is insufficient', async () => {
      // Arrange
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockPrice = 15.99;
      const mockDescription = 'Updated Description';
      const mockAddStock = 5;

      const mockFood = { id: mockFoodId, name: 'Original Food', price: 10.99, description: 'Original Description', stock: 20 };
      const mockCompositions = [{ ingredientId: 1 }, { ingredientId: 2 }];
      const mockIngredients = [{ id: 1, stock: 3 }, { id: 2, stock: 2 }];

      // Set up mock implementation for findOne method in foods
      db.foods.findOne.mockResolvedValue(mockFood);

      // Set up mock implementation for findAll method in contain
      db.contain.findAll.mockResolvedValue(mockCompositions);

      // Set up mock implementation for findAll method in ingredients
      db.ingredients.findAll.mockResolvedValue(mockIngredients);

      // Act
      const result = await foodService.updateFoodByAdmin(mockFoodId, mockName, mockPrice, mockDescription, mockAddStock);

      // Assert
      // Ensure that the result is as expected
      expect(result).toBe('noIngredients');
    });
  });

  // Test case for updateFoodByBaker
  describe('updateFoodByBaker', () => {
    it('should update food by baker with valid inputs', async () => {
      // Arrange
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockDescription = 'Updated Description';
      const mockAddStock = 5;

      const mockFood = { id: mockFoodId, name: 'Original Food', price: 10.99, description: 'Original Description', stock: 20 };
      const mockCompositions = [{ ingredientId: 1 }, { ingredientId: 2 }];
      const mockIngredients = [{ id: 1, stock: 10 }, { id: 2, stock: 8 }];

      // Set up mock implementation for findOne method in foods
      db.foods.findOne.mockResolvedValue(mockFood);

      // Set up mock implementation for findAll method in contain
      db.contain.findAll.mockResolvedValue(mockCompositions);

      // Set up mock implementation for findAll method in ingredients
      db.ingredients.findAll.mockResolvedValue(mockIngredients);

      // Set up mock implementation for update method in ingredients
      db.ingredients.update.mockResolvedValue([1, 1]);

      // Set up mock implementation for update method in foods
      db.foods.update.mockResolvedValue([1]);

      // Act
      const result = await foodService.updateFoodByBaker(mockFoodId, mockName, mockDescription, mockAddStock);

      // Assert
      // Check if the update methods were called with the expected parameters
      expect(db.ingredients.update).toHaveBeenCalledWith(
        { stock: 5 }, // New stock value for ingredients
        { where: { id: { [db.Sequelize.Op.in]: [1, 2] } } } // Condition for updating ingredients
      );

      expect(db.foods.update).toHaveBeenCalledWith(
        {
          name: mockName,
          description: mockDescription,
          stock: mockFood.stock + mockAddStock, // New stock value for food
        },
        { where: { id: mockFoodId } } // Condition for updating food
      );

      // Ensure that the result is as expected
      expect(result).toEqual([1]);
    });

    it('should return "negStock" when addStock is negative', async () => {
      // Arrange
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockDescription = 'Updated Description';
      const mockAddStock = -5;

      // Act
      const result = await foodService.updateFoodByBaker(mockFoodId, mockName, mockDescription, mockAddStock);

      // Assert
      // Ensure that the result is as expected
      expect(result).toBe('negStock');
    });

    it('should return "noIngredients" when ingredient stock is insufficient', async () => {
      // Arrange
      const mockFoodId = 1;
      const mockName = 'Updated Food';
      const mockDescription = 'Updated Description';
      const mockAddStock = 5;

      const mockFood = { id: mockFoodId, name: 'Original Food', price: 10.99, description: 'Original Description', stock: 20 };
      const mockCompositions = [{ ingredientId: 1 }, { ingredientId: 2 }];
      const mockIngredients = [{ id: 1, stock: 3 }, { id: 2, stock: 2 }];

      // Set up mock implementation for findOne method in foods
      db.foods.findOne.mockResolvedValue(mockFood);

      // Set up mock implementation for findAll method in contain
      db.contain.findAll.mockResolvedValue(mockCompositions);

      // Set up mock implementation for findAll method in ingredients
      db.ingredients.findAll.mockResolvedValue(mockIngredients);

      // Act
      const result = await foodService.updateFoodByBaker(mockFoodId, mockName, mockDescription, mockAddStock);

      // Assert
      // Ensure that the result is as expected
      expect(result).toBe('noIngredients');
    });
  });

  // Test case for updatePrice
  describe('updatePrice', () => {
    it('should update the price of a food', async () => {
      // Arrange
      const mockFoodId = 1;
      const mockPrice = 12.99;

      // Set up mock implementation for update method in foods
      db.foods.update.mockResolvedValue([1]);

      // Act
      const result = await foodService.updatePrice(mockFoodId, mockPrice);

      // Assert
      // Check if the update method was called with the expected parameters
      expect(db.foods.update).toHaveBeenCalledWith(
        { price: mockPrice }, // New price value for food
        { where: { id: mockFoodId } } // Condition for updating food
      );

      // Ensure that the result is as expected
      expect(result).toEqual([1]);
    });
  });
});
