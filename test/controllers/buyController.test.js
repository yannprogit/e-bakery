const { getPurchases, addBuy, getBuyById, deleteBuyById, updateDeliveryDate, updateStatus, updateValidation} = require('../../controllers/buyController.js');
const { getPurchases: getPurchasesService, addBuy : addBuyService } = require('../../services/buyService.js');

// Mocking the services
jest.mock('../../services/buyService');

///////////////// GLOBAL CUSTOMERS ////////////////
describe('Buy Controller', () => {

    it('should return a list of purchases with a 200 status code', async () => {
        // Mock data for the purchases
        const mockPurchases = [
          { id: 1, dueDate: '12/02/2021', customerId: 1, foodId: 1, deliverymanId: 1, deliveryDate: '14/02/2021', status: 'cart', validation: 'false', qty: 10 },
          { id: 2, dueDate: '12/02/2021', customerId: 2, foodId: 1, deliverymanId: 1, deliveryDate: '14/02/2021', status: 'cart', validation: 'false', qty: 10 }
        ];
      
        // Mock the behavior of the getPurchases function
        getPurchasesService.mockResolvedValue(mockPurchases);
      
        const req = {};
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        await getPurchases(req, res); // Pass req and res to the controller function
      
        // Verify that the response status and JSON are as expected
        expect(res.status).toHaveBeenCalledWith(200); // Use res instead of response
        expect(res.json).toHaveBeenCalledWith({ success: true, data: mockPurchases });
      
        jest.clearAllMocks();
      });

      const { addBuy } = require('../controllers/buyController');
const { getFoodById, addBuy: addBuyService } = require('../services/buyService');

jest.mock('../services/buyService');

describe('Buy Controller - Add Buy', () => {
  it('should add a buy with a 201 status code', async () => {
    // Mock data for the request
    const mockReq = {
      user: { id: 1 },
      body: { foodId: 1, qty: 5 },
    };

    // Mock data for the response
    const mockFood = { id: 1, name: 'Pizza', price: 10.99, description: 'Delicious pizza', stock: 20 };
    const mockBuy = { id: 1, customerId: 1, foodId: 1, qty: 5 };

    // Mock the behavior of the getFoodById and addBuy services
    getFoodById.mockResolvedValue(mockFood);
    addBuyService.mockResolvedValue(mockBuy);

    // Mock Express response object
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the addBuy method
    await addBuy(mockReq, mockRes);

    // Verify that the response status and JSON are as expected
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, buy: mockBuy });

    jest.clearAllMocks();
  });

  it('should return a 404 status code for a non-existing food', async () => {
    // Mock data for the request
    const mockReq = {
      user: { id: 1 },
      body: { foodId: 1, qty: 5 },
    };

    // Mock the behavior of the getFoodById service when the food doesn't exist
    getFoodById.mockResolvedValue(null);

    // Mock Express response object
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the addBuy method
    await addBuy(mockReq, mockRes);

    // Verify that the response status and JSON are as expected
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This food doesn't exist" });

    jest.clearAllMocks();
  });
});

});