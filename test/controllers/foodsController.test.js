const { getFoods, addFood, getFoodById, deleteFoodById, updateFoodById } = require('../../controllers/foodsController.js');
const { getFoods :getFoodsService , addFood: addFoodService, getFoodById: getFoodByIdService, deleteFoodById: deleteFoodByIdService, updateFoodByAdmin: updateFoodByAdminService, updatePrice:updatePriceService , updateFoodByBaker: updateFoodByBakerService } = require('../../services/foodsService.js');
const foodsService = require('../../services/foodsService.js');
const Ajv = require('ajv');
const ajv = new Ajv();

// Mock the necessary services
jest.mock('../../services/foodsService.js');
jest.mock('ajv');
const mockAjv = new Ajv();


describe('Foods Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFoods', () => {
    it('should return foods and status 200', async () => {
      const mockFoods = [
        { id: '1', name: 'Food 1', description: 'Description 1' },
        { id: '2', name: 'Food 2', description: 'Description 2' },
      ];

      // Mock the behavior of getFoods service
      getFoodsService.mockResolvedValue(mockFoods);

      // Mock Express response object
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the getFoods controller function
      await getFoods({}, mockRes);

      // Expectations
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockFoods });
    });

  });

  describe('addFood', () => {
    it('should add food and return status 201', async () => {
      const mockFood = { id: '1', name: 'New Food', price: 10.99, description: 'New Description', stock: 5 };

      // Mock the behavior of addFood service
      addFoodService.mockResolvedValue(mockFood);

      // Mock Express request and response objects
      const mockReq = {
        body: {
          name: 'New Food',
          price: 10.99,
          description: 'New Description',
          stock: 5,
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the addFood controller function
      await addFood(mockReq, mockRes);

      // Expectations
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, food: mockFood });
    });

    it('should handle an error and return status 400 with an error message', async () => {
      const errorMessage = 'The stock must be over 0';

      // Mock the behavior of addFood service to simulate an error
      addFoodService.mockResolvedValue(null);

      // Mock Express request and response objects
      const mockReq = {
        body: {
          name: 'New Food',
          price: 10.99,
          description: 'New Description',
          stock: 0, // Stock less than or equal to 0 to trigger the error case
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the addFood controller function
      await addFood(mockReq, mockRes);

      // Expectations
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
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


  describe('updateFoodById', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 404 if food does not exist', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'foodId123' },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the behavior of getFoodById service
      getFoodByIdService.mockResolvedValue(null);
  
      // Act
      await updateFoodById(mockReq, mockRes, 'admin');
  
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "This food doesn't exist",
      });
    });


    describe('updateFoodById', () => {
      it('should return 400 if request body is invalid', async () => {
        // Arrange
        const invalidRequestBody = {
          name: 'Updated Food',
          price: 'not_a_number', // Invalid data type for price
          description: 'Updated description',
        };
  
        const mockReq = {
          params: { id: 'foodId123' },
          body: invalidRequestBody,
        };
  
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Mock the behavior of getFoodById
        getFoodByIdService.mockResolvedValue({ id: 'foodId123' });
  
        // Mock the behavior of Ajv validation
        mockAjv.validate.mockReturnValue(false);
        mockAjv.errors = [{ message: 'Invalid data type' }];
  
        // Act
        await updateFoodById(mockReq, mockRes, 'admin');
  
        // Assert
        expect(getFoodByIdService).toHaveBeenCalledWith('foodId123');
        expect(mockAjv.validate).toHaveBeenCalledWith(expect.any(Object), invalidRequestBody);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: mockAjv.errors,
        });
      });
  
    });
  });
});

