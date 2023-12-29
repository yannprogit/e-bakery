const { getPurchases, addBuy, getBuyById, deleteBuyById, updateDeliveryDate, updateStatus, updateValidation} = require('../../controllers/buyController.js');
const { getPurchases: getPurchasesService, addBuy : addBuyService, getBuyById : getBuyByIdService, deleteBuyById : deleteBuyByIdService, updateDeliveryDate : updateDeliveryDateService } = require('../../services/buyService.js');
const { getFoods: getFoodsService, getFoodById : getFoodByIdService } = require('../../services/foodsService.js');

// Mocking the services
jest.mock('../../services/buyService');
jest.mock('../../services/foodsService');

///////////////// GET A LIST OF PURCHASES ////////////////
describe('GET LIST OF BUY', () => {
  it('Return a list of purchases - status : 200', async () => {

    const ListOfPurchases = [
      { id: 1, dueDate: '12/02/2021', customerId: 1, foodId: 1, deliverymanId: 1, deliveryDate: '14/02/2021', status: 'cart', validation: 'false', qty: 10 },
      { id: 2, dueDate: '18/02/2021', customerId: 2, foodId: 1, deliverymanId: 2, deliveryDate: '22/02/2021', status: 'cart', validation: 'false', qty: 10 }
    ];
      
    // Mock the behavior of the getPurchases function
    getPurchasesService.mockResolvedValue(ListOfPurchases);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getPurchases(req, res);
      
    // Verify that the response status and JSON are as expected
    expect(res.status).toHaveBeenCalledWith(200); // Use res instead of response
    expect(res.json).toHaveBeenCalledWith({ success: true, data: ListOfPurchases });
      
    jest.clearAllMocks();

  });
});

///////////////// POST ADD BUY ////////////////
describe('POST Add Buy', () => {
  it('Add a buy - status : 201', async () => {
    const req = {
      user: { 
        id :1
       },
      body: { 
      id : 1,
      foodId: 1, 
      qty: 5 },
    };

    const mockFood = { id: 1, name: 'Pizza', price: 10.99, description: 'Delicious pizza', stock: 20 };
    const mockBuy = { id: 1, customerId: 1, foodId: 1, qty: 5 };

    getFoodByIdService.mockResolvedValue(mockFood);
    addBuyService.mockResolvedValue(mockBuy);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addBuy(req, res, 1);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, buy: mockBuy });

    jest.clearAllMocks();

  });

  it(' Non-existing food - status : 404', async () => {
    const req = {
      body: { foodId: 1,qty: 5 },
    };

    getFoodByIdService.mockResolvedValue(null);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addBuy(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "This food doesn't exist" });

    jest.clearAllMocks();

  });
});

///////////////// GET BUY BY ID////////////////
describe('GET BUY BY ID', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Get a buy by ID when it exists and user has permission - status: 200', async () => {
    const mockBuy = { id: 1, customerId: 123, deliverymanId: null, status: 'pending' };
  
    getBuyByIdService.mockResolvedValueOnce(mockBuy);
  
    const mockReq = {
      params: { id: 1 },
      user: { id: 123, role: 'customer' },
    };
  
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await getBuyById(mockReq, mockRes);
  
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockBuy });
  });
  

  it('Non-existing buy - status: 404', async () => {
    // Mock the getBuyById service to return null (non-existent buy)
    getBuyByIdService.mockResolvedValueOnce(null);
  
    // Mock the request and response objects
    const mockReq = {
      params: { id: 1 },
      user: { id: 123, role: 'customer' },
    };
  
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    // Act
    await getBuyById(mockReq, mockRes);
  
    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This buy doesn't exist" });
  });

  it('should return 403 when accessing a buy that does not belong to the user', async () => {
    // Arrange
    const req = {
      params: {
        id: '1'
      },
    };
    // Modify the mockBuy object to include the necessary data
    const buy = { id: 1, customerId: 4, deliverymanId: 1, status: 'pending' };
  
    // Mock the getBuyById function to return the mockBuy object
    getBuyByIdService.mockResolvedValue(buy);
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    // Act
    await getBuyById(req, res, 2, 'customer');
  
    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access forbidden: You cannot view an order that does not belong to you'
    });
  });  
});  

///////////////// DELETE BUY BY ID ////////////////
describe('deleteBuyById', () => {
  it('should delete a buy with valid conditions', async () => {
    // Mock data for the request
    const req = {
      params: {
        id: '1',
      },
    };

    // Mock data for the response
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Mock data for the buy
    const buy = {
      id: '1',
      customerId: 1,
      status: 'cart',
    };

    // Mock the getBuyByIdService to return the buy
    getBuyByIdService.mockResolvedValue(buy);

    // Mock the deleteBuyByIdService
    deleteBuyByIdService.mockReturnValueOnce(true);

    // Call the controller function
    await deleteBuyById(req, res, 1);

    // Assertions
    expect(getBuyByIdService).toHaveBeenCalledWith('1');
    expect(deleteBuyByIdService).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();

    // Reset mocks
    jest.clearAllMocks();
  });


  it('should return 404 for a non-existent buy', async () => {
    // Arrange
    const mockBuyId = 1;
    const mockCustomerId = 123;
    const mockRole = 'customer';
  
    // Mock the getBuyById service to return null (non-existent buy)
    getBuyByIdService.mockResolvedValue(null);
  
    const req = { params: { id: mockBuyId }, user: { id: mockCustomerId, role: mockRole } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    // Act
    await deleteBuyById(req, res);
  
    // Assert
    expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "This buy doesn't exist" });
  });
});

///////////////// UPDATE BUY BY ID ////////////////
