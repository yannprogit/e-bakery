const { getFoods, 
  addFood, 
  getFoodById, 
  deleteFoodById, 
  updateFoodById, 
  updateFoodByAdmin,
  updateFoodByBaker,
} = require('../../controllers/foodsController.js');

const { 
  getFoods :getFoodsService , 
  addFood : addFoodService, 
  getFoodById : getFoodByIdService, 
  deleteFoodById : deleteFoodByIdService, 
  updateFoodByAdmin : updateFoodByAdminService, 
  updatePrice : updatePriceService , 
  updateFoodByBaker : updateFoodByBakerService,
 } = require('../../services/foodsService.js');

const foodsService = require('../../services/foodsService.js');

const Ajv = require('ajv');
const ajv = new Ajv();

// Mock the necessary services
jest.mock('../../services/foodsService.js');


describe('Foods Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
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
      await updateFoodById(mockReq, mockRes, 'admin');  // Make sure to use the correct function

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "This food doesn't exist",
      });
    });

    it('should return 400 if request body does not match the schema', async () => {
      // Arrange
      const mockReq = {
          params: { id: 'foodId123' },
          body: {
              invalidField: 'Invalid value',
          },
      };
      const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the behavior of AJV validation
      jest.spyOn(ajv, 'validate').mockReturnValue(false);
      ajv.errors = [{ message: 'Validation error message' }];

      // Mock the behavior of updateFoodByAdmin service
      updateFoodByAdminService.mockResolvedValue(null);

      // Act
      await updateFoodByAdmin(mockReq, mockRes, 'admin');

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: 'Validation error message',
      });
  });
    
    it('should update food and return 204 if request is valid', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'foodId123' },
        body: {
          name: 'UpdatedFood',
          price: 10,
          description: 'Updated description',
          addStock: 5,
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mock the behavior of AJV validation
      jest.spyOn(ajv, 'validate').mockReturnValue(true);
      ajv.errors = [{ message: 'Validation error message' }];
      
      // Mock the behavior of getFoodById service
      getFoodByIdService.mockResolvedValue({
        id: 'foodId123',
        name: 'CurrentFood',
        price: 5,
        description: 'Current description',
        stock: 10,
      });

      // Mock the behavior of updateFoodByAdmin service
      updateFoodByAdminService.mockResolvedValue(true);

      // Act
      await updateFoodById(mockReq, mockRes, 'admin');  // Make sure to use the correct function

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 400 if addition of stock is less than or equal to 0', async () => {
      // Arrange
      const mockReq = {
          params: { id: 'foodId123' },
          body: {
              name: 'UpdatedFood',
              price: 10,
              description: 'Updated description',
              addStock: 0,  // Set to 0 or a negative value
          },
      };
      const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the behavior of updateFoodByAdmin service
      updateFoodByAdminService.mockResolvedValue("negStock");

      // Act
      await updateFoodById(mockReq, mockRes, 'admin');

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: "The addition of stock must be over 0",
      });
  });

  it('should return 422 if no compositions are added to the food', async () => {
      // Arrange
      const mockReq = {
          params: { id: 'foodId123' },
          body: {
              name: 'UpdatedFood',
              price: 10,
              description: 'Updated description',
              addStock: 5,
          },
      };
      const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the behavior of updateFoodByAdmin service
      updateFoodByAdminService.mockResolvedValue("noCompositions");

      // Act
      await updateFoodById(mockReq, mockRes, 'admin');

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: "You must add compositions to this food to be able to add stocks",
      });
  });

  it('should return 422 if there are not enough ingredients to increase the stock', async () => {
      // Arrange
      const mockReq = {
          params: { id: 'foodId123' },
          body: {
              name: 'UpdatedFood',
              price: 10,
              description: 'Updated description',
              addStock: 5,
          },
      };
      const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the behavior of updateFoodByAdmin service
      updateFoodByAdminService.mockResolvedValue(false);

      // Act
      await updateFoodById(mockReq, mockRes, 'admin');

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: "There aren't enough ingredients left to increase the stock of this food",
      });
  });

  it('should return 204 if the food is updated successfully', async () => {
      // Arrange
      const mockReq = {
          params: { id: 'foodId123' },
          body: {
              name: 'UpdatedFood',
              price: 10,
              description: 'Updated description',
              addStock: 5,
          },
      };
      const mockRes = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
      };

      // Mock the behavior of updateFoodByAdmin service
      updateFoodByAdminService.mockResolvedValue(true);

      // Act
      await updateFoodById(mockReq, mockRes, 'admin');

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
  });

  });

  describe('updateFoodById for Baker', () => {
    it('should return 400 if request body does not match the schema for baker', async () => {
        // Arrange
        const mockReq = {
            params: { id: 'foodId123' },
            body: {
                invalidField: 'Invalid value',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the behavior of AJV validation
        jest.spyOn(ajv, 'validate').mockReturnValue(false);
        ajv.errors = [{ message: 'Validation error message' }];

        // Act
        await updateFoodById(mockReq, mockRes, 'baker');

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: expect.arrayContaining([
              {
                instancePath: "",
                keyword: "required",
                message: "must have required property 'name'",
                params: {
                  missingProperty: "name",
                },
                schemaPath: "#/required",
              },
            ]),
        });
    });
    it('should return 400 if the addition of stock is not over 0', async () => {
      // Arrange
      const foodId = 'foodId123';
      const name = 'UpdatedFood';
      const description = 'Updated description';
      const addStock = 0; // Invalid stock value
      const expectedErrorMessage = "The addition of stock must be over 0";
  
      // Act
      const result = await updateFoodByBaker(foodId, name, description, addStock);
  
      // Assert
      expect(result).toEqual(expectedErrorMessage);
    });
  
    it('should return 422 if there are no compositions for the food', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'foodId123' },
        body: {
          name: 'UpdatedFood',
          description: 'Updated description',
          addStock: 5,
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the behavior of getFoodById service
      getFoodByIdService.mockResolvedValue(null);

      // Mock the behavior of the updateFoodByBaker service
      updateFoodByBakerService.mockResolvedValue("noCompositions");

      // Act
      await updateFoodById(mockReq, mockRes, 'baker');

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "You must add compositions to this food to be able to add stocks",
      });
    });
  
    it('should return 422 if there are not enough ingredients left to increase the stock', async () => {
      // Arrange
      const foodId = 'foodId123';
      const name = 'UpdatedFood';
      const description = 'Updated description';
      const addStock = 5; // Valid stock value
      const expectedErrorMessage = "There aren't enough ingredients left to increase the stock of this food";
  
      // Mock the behavior of the updateFoodByBaker service
      jest.spyOn(foodsService, 'updateFoodByBaker').mockResolvedValue(false);
  
      // Act
      const result = await updateFoodByBaker(foodId, name, description, addStock);
  
      // Assert
      expect(result).toEqual(expectedErrorMessage);
    });
  
    it('should return true and not throw errors for valid input', async () => {
      // Arrange
      const foodId = 'foodId123';
      const name = 'UpdatedFood';
      const description = 'Updated description';
      const addStock = 5; // Valid stock value
  
      // Mock the behavior of the updateFoodByBaker service
      jest.spyOn(foodsService, 'updateFoodByBaker').mockResolvedValue(true);
  
      // Act and Assert
      await expect(updateFoodByBaker(foodId, name, description, addStock)).resolves.toBe(true);
    });


});
});

