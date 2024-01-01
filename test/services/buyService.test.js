const db = require('../../models/index.js');
const {getPurchases,addBuy,getBuyById,deleteBuyById,updateDeliveryDate,updateStatus,updateValidation,} = require('../../services/buyService.js');

jest.mock('../../models/index.js');

describe('Buy Service', () => {

  it('should return a list of purchases', async () => {
    const mockPurchases = [
      { id: 1, customerId: 1, foodId: 1, qty: 5 },
      { id: 2, customerId: 2, foodId: 2, qty: 3 },
    ];

    db.buy.findAll.mockResolvedValue(mockPurchases);

    const result = await getPurchases();

    expect(result).toEqual(mockPurchases);
  });

  it('should add a purchase', async () => {
    const mockRequest = {
      customerId: 1,
      foodId: 1,
      qty: 5,
    };

    db.buy.create.mockResolvedValue({ id: 1, ...mockRequest });

    const result = await addBuy(mockRequest.customerId, mockRequest.foodId, mockRequest.qty);

    expect(result).toEqual({ id: 1, ...mockRequest });
  });


  afterEach(() => {
    jest.clearAllMocks();
  });
});


describe('Buy Service', () => {
  
    it('should return a purchase by its id', async () => {
      const mockPurchase = { id: 1, customerId: 1, foodId: 1, qty: 5 };
  
      db.buy.findOne.mockResolvedValue(mockPurchase);
  
      const result = await getBuyById(1);
  
      expect(result).toEqual(mockPurchase);
    });
  
    it('should delete a purchase by its id', async () => {
      db.buy.destroy.mockResolvedValue(1);
  
      const result = await deleteBuyById(1);
  
      expect(result).toBe(1);
    });
  });
