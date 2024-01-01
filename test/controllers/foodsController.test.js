///////////////// IMPORT ALL THE FUNCTIONS ////////////////
const { getFoods, addFood, getFoodById, deleteFoodById, updateFoodById } = require('../../controllers/foodsController.js');
const { getFoods :getFoodsService , addFood: addFoodService, getFoodById: getFoodByIdService, deleteFoodById: deleteFoodByIdService, updateFoodByAdmin: updateFoodByAdminService, updatePrice: updatePriceService , updateFoodByBaker: updateFoodByBakerService } = require('../../services/foodsService.js');

///////////////// MOCKING THE SERVICES ////////////////
jest.mock('../../services/foodsService.js');

///////////////// FOOD CONTROLLER ////////////////
describe('Foods Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  ///////////////// GET FOODS ////////////////
  describe('getFoods', () => {
    it('should return foods and status 200', async () => {
      const mockFoods = [
        { id: 1, name: 'Food 1', description: 'Description 1' },
        { id: 2, name: 'Food 2', description: 'Description 2' },
      ];

      getFoodsService.mockResolvedValue(mockFoods);

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getFoods({}, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockFoods });
    });

  });

  ///////////////// ADD FOOD ////////////////
  describe('addFood', () => {
    it('should add food and return status 201', async () => {
      const mockFood = { id: 1, name: 'New Food', price: 10.99, description: 'New Description', stock: 5 };

      addFoodService.mockResolvedValue(mockFood);

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

      await addFood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, food: mockFood });
    });

    it('should handle an error and return status 400 with an error message', async () => {
      const errorMessage = 'The stock must be over 0';

      addFoodService.mockResolvedValue(null);

      const mockReq = {
        body: {
          name: 'New Food',
          price: 10.99,
          description: 'New Description',
          stock: 0,
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await addFood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });
  });

  ///////////////// GET FOOD ////////////////
  describe('Get Food by ID', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should get a food by ID successfully', async () => {
      const mockReq = {
        params: { id: 1 },
      };

      const mockFood = { id: 1, name: 'Pizza', price: 10.99, description: 'Delicious pizza', stock: 20 };

      getFoodByIdService.mockResolvedValue(mockFood);

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getFoodById(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockFood });
    });
  
    it('should handle error when getting a food by ID', async () => {
      const mockReq = {
        params: { id: 1 },
      };

      getFoodByIdService.mockResolvedValue(null);

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await getFoodById(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This food doesn't exist" });
    });
  });


  ///////////////// DELETE FOOD ////////////////
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

        getFoodByIdService.mockResolvedValue({
            id: 'foodId123',
            name: 'Pizza',
            description: 'Delicious pizza',
        });

        deleteFoodByIdService.mockResolvedValue(true);

        await deleteFoodById(req, res);

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

        getFoodByIdService.mockResolvedValue(null);

        await deleteFoodById(req, res);

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

      getFoodByIdService.mockResolvedValue({
          id: 'foodId123',
          name: 'Burger',
          description: 'Tasty burger',
      });

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
      const mockReq = {
        params: { id: 1 },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      getFoodByIdService.mockResolvedValue(null);
  
      await updateFoodById(mockReq, mockRes, 'admin');
  
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "This food doesn't exist",
      });
    });

    it('should update a food by admin successfully', async () => {
      const req = {
          params: {
              id: 1,
          },
          body: {
              name: 'Msemmen',
              price: 3.50,
              description: 'it is a msemmen',
              addStock: 3
          },
      };

      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          send: jest.fn(),
      };

      getFoodByIdService.mockResolvedValueOnce({
          id: 1
      });

      updateFoodByAdminService.mockResolvedValueOnce({});

      await updateFoodById(req, res, 1, 'admin');

      expect(res.status).toHaveBeenCalledWith(204); 
      expect(res.json).not.toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
  });

  it('should update a price by cashier successfully', async () => {
    const req = {
        params: {
            id: 1,
        },
        body: {
            price: 3.50
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
    };

    getFoodByIdService.mockResolvedValueOnce({
        id: 1
    });

    updatePriceService.mockResolvedValueOnce({});

    await updateFoodById(req, res, 1, 'cashier');

    expect(res.status).toHaveBeenCalledWith(204); 
    expect(res.json).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

  it('should update a food by baker successfully', async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        name: 'Msemmen',
        description: 'It is a msemmen',
        addStock: 5
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    getFoodByIdService.mockResolvedValueOnce({
      id: 1
    });

    updateFoodByBakerService.mockResolvedValueOnce({});

    await updateFoodById(req, res, 'baker');

    expect(res.status).toHaveBeenCalledWith(204); 
    expect(res.json).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

  it('should return 400 status when updating food by admin with invalid request body', async () => {
    const req = {
        params: {
            id: 1,
        },
        body: {
            
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
    };

    getFoodByIdService.mockResolvedValueOnce({
        id: 1
    });

    await updateFoodById(req, res, 1, 'admin');

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(Array),
    });
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should return 400 status when updating food by baker with invalid request body', async () => {
    const req = {
        params: {
            id: 1,
        },
        body: {
            
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
    };

    getFoodByIdService.mockResolvedValueOnce({
        id: 1
    });

    await updateFoodById(req, res, 1, 'baker');

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(Array),
    });
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should return 400 status when updating price by cashier with invalid request body', async () => {
    const req = {
        params: {
            id: 1,
        },
        body: {
            
        },
    };
  
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
    };
  
    getFoodByIdService.mockResolvedValueOnce({
        id: 1
    });
  
    await updateFoodById(req, res, 1, 'cashier');
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(Array),
    });
    expect(res.send).not.toHaveBeenCalled();
  });
  });
});

