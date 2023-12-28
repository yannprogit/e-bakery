const { getFoods, addFood, getFoodById, deleteFoodById, updateFoodById } = require('../../controllers/foodsController.js');
const { getFoods :getFoodsService , addFood: addFoodService, getFoodById: getFoodByIdService, deleteFoodById: deleteFoodByIdService, updateFoodByAdmin: updateFoodByAdminService, updatePrice:updatePriceService , updateFoodByBaker: updateFoodByBakerService } = require('../../services/foodsService.js');
const foodsService = require('../../services/foodsService.js');


// Mock the necessary services
jest.mock('../../services/foodsService.js');


describe('Foods Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET FOOD', () => {

  it('should get the list of foods', async () => {
    // Mock data for the request
    const mockReq = {};
  
    // Mock data for the response
    const mockFoods = [{ id: 1, name: 'Kebab', price: 10.99, description: 'Delicious kebab', stock: 20 }];
  
    // Mock the behavior of the getFoods service
    getFoodsService.mockResolvedValue(mockFoods);
  
    // Mock Express response object
    const mockRes = {
      json: jest.fn(),
    };
  
    // Call the getFoods method
    await getFoods(mockReq, mockRes);
  
    // Verify that the response is as expected
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockFoods });
  });

  describe('Foods Controller - Add Food', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should add a food successfully', async () => {
      // Mock data for the request
      const mockReq = {
        body: {
          name: 'Pizza',
          price: 10.99,
          description: 'Delicious pizza',
          stock: 20,
        },
      };
  
      // Mock data for the response
      const mockFood = { id: 1, name: 'Pizza', price: 10.99, description: 'Delicious pizza', stock: 20 };
  
      // Mock the behavior of the addFood service
      addFoodService.mockResolvedValue(mockFood);
  
      // Mock Express response object
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Call the addFood method
      await addFood(mockReq, mockRes);
  
      // Verify that the response status and JSON are as expected
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, food: mockFood });
    });
  
    it('should handle error when creating a food', async () => {
      // Mock data for the request
      const mockReq = {
        body: {
          // Provide incomplete or incorrect data to simulate an error
          name: 'Pizza',
          price: 10.99,
        },
      };
  
      // Mock the behavior of the addFood service when an error occurs
      addFoodService.mockResolvedValue(null);
  
      // Mock Express response object
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Call the addFood method
      await addFood(mockReq, mockRes);
  
      // Verify that the response status and JSON are as expected for an error
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Error when creating this food, verify your args' });
    });
  });

  describe('Foods Controller - Get Food by ID', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should get a food by ID successfully', async () => {
      // Mock data for the request
      const mockReq = {
        params: { id: 1 },
      };
  
      // Mock data for the response
      const mockFood = { id: 1, name: 'Pizza', price: 10.99, description: 'Delicious pizza', stock: 20 };
  
      // Mock the behavior of the getFoodById service
      getFoodByIdService.mockResolvedValue(mockFood);
  
      // Mock Express response object
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Call the getFoodById method
      await getFoodById(mockReq, mockRes);
  
      // Verify that the response status and JSON are as expected
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockFood });
    });
  
    it('should handle error when getting a food by ID', async () => {
      // Mock data for the request
      const mockReq = {
        params: { id: 1 },
      };
  
      // Mock the behavior of the getFoodById service when an error occurs
      getFoodByIdService.mockResolvedValue(null);
  
      // Mock Express response object
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Call the getFoodById method
      await getFoodById(mockReq, mockRes);
  
      // Verify that the response status and JSON are as expected for an error
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This food doesn't exist" });
    });
  });



  describe('deleteFoodById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a food when it exists', async () => {
        const req = {
            params: {
                id: 'foodId123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };

        // Mock getFoodById function to simulate an existing food
        getFoodByIdService.mockResolvedValue({
            id: 'foodId123',
            name: 'Pizza',
            description: 'Delicious pizza',
        });

        // Mock deleteFoodById function to simulate successful deletion
        deleteFoodByIdService.mockResolvedValue(true);

        await deleteFoodById(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 error when food does not exist', async () => {
        const req = {
            params: {
                id: 'nonexistentFoodId',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };

        // Mock getFoodById function to simulate a non-existent food
        getFoodByIdService.mockResolvedValue(null);

        await deleteFoodById(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "This food doesn't exist" });
    });

    it('should return 422 status when food is still being delivered', async () => {
      const req = {
          params: {
              id: 'foodId123',
          },
      };

      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          send: jest.fn(),
      };

      // Mock getFoodById function to simulate an existing food
      getFoodByIdService.mockResolvedValue({
          id: 'foodId123',
          name: 'Burger',
          description: 'Tasty burger',
      });

      // Mock deleteFoodById function to simulate unfinished deliveries
      deleteFoodByIdService.mockResolvedValue(false);

      await deleteFoodById(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "This food is still being delivered" });
  });
  });
});
});
