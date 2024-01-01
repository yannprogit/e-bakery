///////////////// IMPORT ALL THE FUNCTIONS ////////////////
const { getPurchases, addBuy, getBuyById, deleteBuyById, updateDeliveryDate, updateStatus, updateValidation, updateBuyById} = require('../../controllers/buyController.js');
const { getPurchases: getPurchasesService, addBuy : addBuyService, getBuyById : getBuyByIdService, deleteBuyById : deleteBuyByIdService, updateDeliveryDate : updateDeliveryDateService, updateBuyById : updateBuyByIdService, updateStatus: updateStatusService } = require('../../services/buyService.js');
const { getFoods: getFoodsService, getFoodById : getFoodByIdService } = require('../../services/foodsService.js');

///////////////// MOCKING THE SERVICES ////////////////
jest.mock('../../services/buyService');
jest.mock('../../services/foodsService');

///////////////// GET A LIST OF PURCHASES ////////////////
describe('GET LIST OF BUY', () => {
  it('Return a list of purchases - status : 200', async () => {

    const ListOfPurchases = [
      { id: 1, dueDate: '12/02/2021', customerId: 1, foodId: 1, deliverymanId: 1, deliveryDate: '14/02/2021', status: 'cart', validation: 'false', qty: 10 },
      { id: 2, dueDate: '18/02/2021', customerId: 2, foodId: 1, deliverymanId: 2, deliveryDate: '22/02/2021', status: 'cart', validation: 'false', qty: 10 }
    ];
      
    getPurchasesService.mockResolvedValue(ListOfPurchases);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getPurchases(req, res);
      
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: ListOfPurchases });
      
    jest.clearAllMocks();

  });
});

///////////////// ADD BUY ////////////////
describe('Add Buy', () => {
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

    //Mock data of food and buy
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
    const mockReq = {
      params: { id: 1 },
      user: { id: 123, role: 'customer' },
    };
  
    getBuyByIdService.mockResolvedValueOnce(null);
 
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await getBuyById(mockReq, mockRes);
  
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This buy doesn't exist" });
  });

  it('should return 403 when accessing a buy that does not belong to the user', async () => {
    const req = {
      params: {
        id: '1'
      },
    };

    const buy = { id: 1, customerId: 4, deliverymanId: 1, status: 'pending' };
  
    getBuyByIdService.mockResolvedValue(buy);
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getBuyById(req, res, 2, 'customer');
  
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
    const req = {
      params: {
        id: '1',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    const buy = {
      id: '1',
      customerId: 1,
      status: 'cart',
    };

    getBuyByIdService.mockResolvedValue(buy);

    deleteBuyByIdService.mockReturnValueOnce(true);

    await deleteBuyById(req, res, 1);

    expect(getBuyByIdService).toHaveBeenCalledWith('1');
    expect(deleteBuyByIdService).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();

    jest.clearAllMocks();
  });


  it('should return 404 for a non-existent buy', async () => {
    const mockBuyId = 1;
    const mockCustomerId = 123;
    const mockRole = 'customer';
  
    getBuyByIdService.mockResolvedValue(null);
  
    const req = { params: { id: mockBuyId }, user: { id: mockCustomerId, role: mockRole } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await deleteBuyById(req, res);
  
    expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "This buy doesn't exist" });
  });
});




///////////////// UPDATE BUY BY ID ////////////////
describe('updateBuyById', () => {
  afterEach(() => {
      jest.clearAllMocks();
  });

  it('should return 404 if the buy does not exist', async () => {
      getBuyByIdService.mockResolvedValue(null);

      const req = {
          params: { id: 'exampleBuyId' },
      };

      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      await updateBuyById(req, res, 'exampleUserId', 'customer');

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "This buy doesn't exist" });
  });

  it('should return 403 if the user does not have permission to update the buy', async () => {
    const mockBuy = {
        id: 'exampleBuyId',
        customerId: 'otherUserId',
        deliverymanId: 'exampleDeliverymanId',
    };
    getBuyByIdService.mockResolvedValue(mockBuy);

    const req = {
        params: { id: 'exampleBuyId' },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await updateBuyById(req, res, 'exampleUserId', 'customer');

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access forbidden: You cannot update an order that does not belong to you',
    });
});

it('should allow access for Customer with matching ID', async () => {
  const mockBuy = {
    id: 'exampleBuyId',
    customerId: 'exampleCustomerId',
  };
  getBuyByIdService.mockResolvedValue(mockBuy);

  const req = {
    params: { id: 'exampleBuyId' },
    body: {},
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  await updateBuyById(req, res, 'exampleCustomerId', 'customer');

  expect(res.status).not.toHaveBeenCalledWith(403);
  expect(res.json).not.toHaveBeenCalledWith({
    success: false,
    message: 'Access forbidden: You cannot update an order that does not belong to you',
  });
});

it('should allow access for Deliveryman with matching ID', async () => {
  const mockBuy = {
    id: 'exampleBuyId',
    deliverymanId: 'exampleDeliverymanId'
  };
  getBuyByIdService.mockResolvedValue(mockBuy);

  const req = {
    params: { id: 'exampleBuyId' },
    body: {},
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  await updateBuyById(req, res, 'exampleDeliverymanId', 'deliveryman');

  expect(res.status).not.toHaveBeenCalledWith(403);
  expect(res.json).not.toHaveBeenCalledWith({
    success: false,
    message: 'Access forbidden: You cannot update an order that does not belong to you',
  });
});

it('should allow access for Admin (temporary customer role) when updating customer-related information', async () => {
  const mockBuy = {
    id: 'exampleBuyId',
    customerId: 'exampleCustomerId'
  };
  getBuyByIdService.mockResolvedValue(mockBuy);

  const req = {
    params: { id: 'exampleBuyId' },
    body: {},
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  await updateBuyById(req, res, 'exampleAdminId', 'admin');

  expect(res.status).not.toHaveBeenCalledWith(403);
  expect(res.json).not.toHaveBeenCalledWith({
    success: false,
    message: 'Access forbidden: You cannot update an order that does not belong to you',
  });
});

it('should allow access for Admin (temporary deliveryman role) when updating deliveryman-related information', async () => {
  const mockBuy = {
    id: 'exampleBuyId',
    deliverymanId: 'exampleDeliverymanId'
  };
  getBuyByIdService.mockResolvedValue(mockBuy);

  const req = {
    params: { id: 'exampleBuyId' },
    body: {},
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  await updateBuyById(req, res, 'exampleAdminId', 'admin');

  expect(res.status).not.toHaveBeenCalledWith(403);
  expect(res.json).not.toHaveBeenCalledWith({
    success: false,
    message: 'Access forbidden: You cannot update an order that does not belong to you',
  });
});


it('should update delivery date and return status 422 for a deliveryman', async () => {
      const mockBuy = {
        id: 'exampleBuyId',
        deliverymanId: 'exampleUserId',
        deliveryDate : "20/08/2028"
    };

    const req = {
        params: {
           id: 'exampleBuyId'
           },
    };

    getBuyByIdService.mockResolvedValue(mockBuy);
    updateDeliveryDateService.mockResolvedValue("20/08/2028")

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await updateBuyById(req, res, 'exampleUserId', 'deliveryman');

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'The delivery of this buy is already finished',
    });
});

it('should update delivery date and return status 204 for a deliveryman', async () => {
  const mockBuy = {
    id: 'exampleBuyId',
    deliverymanId: 'exampleUserId',
    deliveryDate: null,
  };

  const req = {
    params: {
      id: 'exampleBuyId',
    },
  };

  getBuyByIdService.mockResolvedValue(mockBuy);
  updateDeliveryDateService.mockResolvedValue(); 

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  await updateBuyById(req, res, 'exampleUserId', 'deliveryman');

  expect(res.status).toHaveBeenCalledWith(204);
  expect(res.json).not.toHaveBeenCalled();
  expect(res.send).toHaveBeenCalled(); 
});



it('should update buy status to "pending" and return status 204 for a cart with valid time', async () => {
  const mockBuyId = 1;
  const mockUserId = 123;
  const mockUserRole = 'customer';

  const mockBuy = {
    id: mockBuyId,
    customerId: mockUserId,
    deliverymanId: null,
    status: 'cart',
  };

  getBuyByIdService.mockResolvedValueOnce(mockBuy);

  updateStatusService.mockResolvedValueOnce('validStatus');

  const mockReq = {
    params: { id: mockBuyId },
    body: { hour: '12:30' },
    user: { id: mockUserId, role: mockUserRole },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  await updateBuyById(mockReq, mockRes);

  expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
  expect(updateStatusService).toHaveBeenCalledWith(mockBuyId, '12:30');
  expect(mockRes.status).toHaveBeenCalledWith(204);
  expect(mockRes.send).toHaveBeenCalled();
});

it('should return status 422 for cart with invalid time', async () => {
  const mockBuyId = 1;
  const mockUserId = 123;
  const mockUserRole = 'customer';

  const mockBuy = {
    id: mockBuyId,
    customerId: mockUserId,
    deliverymanId: null,
    status: 'cart',
  };

  getBuyByIdService.mockResolvedValueOnce(mockBuy);

  const mockReq = {
    params: { id: mockBuyId },
    body: { hour: 'invalidTime' },
    user: { id: mockUserId, role: mockUserRole },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await updateBuyById(mockReq, mockRes);

  expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
  expect(updateStatusService).not.toHaveBeenCalled();
  expect(mockRes.status).toHaveBeenCalledWith(422);
  expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'The time you have entered is incorrect, please enter a valid time (format: hour:min)' });
});

afterEach(() => {
  jest.clearAllMocks();
});


it('should update status for a cart with valid time', async () => {
    const mockBuyId = 'exampleBuyId';
    const mockUserId = 123;
    const mockUserRole = 'customer';

    const mockBuy = {
      id: mockBuyId,
      customerId: mockUserId,
      deliverymanId: null,
      status: 'cart',
    };

    getBuyByIdService.mockResolvedValueOnce(mockBuy);

    updateStatusService.mockResolvedValueOnce('validStatus');

    const mockReq = {
      params: { id: mockBuyId },
      body: { hour: '12:30' },
      user: { id: mockUserId, role: mockUserRole },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await updateBuyById(mockReq, mockRes);

    expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
    expect(updateStatusService).toHaveBeenCalledWith(mockBuyId, '12:30');
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('should return status 422 for cart with invalid time', async () => {
    const mockBuyId = 'exampleBuyId';
    const mockUserId = 123;
    const mockUserRole = 'customer';

    const mockBuy = {
      id: mockBuyId,
      customerId: mockUserId,
      deliverymanId: null,
      status: 'cart',
    };

    getBuyByIdService.mockResolvedValueOnce(mockBuy);

    const mockReq = {
      params: { id: mockBuyId },
      body: { hour: 'invalidTime' },
      user: { id: mockUserId, role: mockUserRole },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateBuyById(mockReq, mockRes);

    expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
    expect(updateStatusService).not.toHaveBeenCalled(); 
    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'The time you have entered is incorrect, please enter a valid time (format: hour:min)',
    });
  });

  it('should return status 422 for cart with no foods in stock', async () => {
    const mockBuyId = 'exampleBuyId';
    const mockUserId = 123;
    const mockUserRole = 'customer';

    const mockBuy = {
      id: mockBuyId,
      customerId: mockUserId,
      deliverymanId: null,
      status: 'cart',
    };

    getBuyByIdService.mockResolvedValueOnce(mockBuy);

    const mockReq = {
      params: { id: mockBuyId },
      body: { hour: '12:30' },
      user: { id: mockUserId, role: mockUserRole },
    };

    updateStatusService.mockResolvedValueOnce('noFoods');

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Act
    await updateBuyById(mockReq, mockRes);

    // Assert
    expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
    expect(updateStatusService).toHaveBeenCalledWith(mockBuyId, '12:30');
    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'No more food in stock',
    });
  });

  it('should return status 422 for cart with no available deliverymen', async () => {
    const mockBuyId = 'exampleBuyId';
    const mockUserId = 123;
    const mockUserRole = 'customer';

    const mockBuy = {
      id: mockBuyId,
      customerId: mockUserId,
      deliverymanId: null,
      status: 'cart',
    };

    getBuyByIdService.mockResolvedValueOnce(mockBuy);

    const mockReq = {
      params: { id: mockBuyId },
      body: { hour: '12:30' },
      user: { id: mockUserId, role: mockUserRole },
    };

    updateStatusService.mockResolvedValueOnce('noDeliverymen');

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateBuyById(mockReq, mockRes);

    expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
    expect(updateStatusService).toHaveBeenCalledWith(mockBuyId, '12:30');
    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'No deliverymen available, please change delivery hour or order later',
    });
  });






  it('should update status for a cart with valid time', async () => {
 
    const mockBuyId = 'exampleBuyId';
    const mockUserId = 123;
    const mockUserRole = 'customer';

    const mockBuy = {
      id: mockBuyId,
      customerId: mockUserId,
      deliverymanId: null,
      status: 'cart',
    };

    getBuyByIdService.mockResolvedValueOnce(mockBuy);

    updateStatusService.mockResolvedValueOnce('validStatus');

    const mockReq = {
      params: { id: mockBuyId },
      body: { hour: '12:30' },
      user: { id: mockUserId, role: mockUserRole },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await updateBuyById(mockReq, mockRes);

    expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
    expect(updateStatusService).toHaveBeenCalledWith(mockBuyId, '12:30');
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('should return status 422 for cart with invalid time', async () => {
    const mockBuyId = 'exampleBuyId';
    const mockUserId = 123;
    const mockUserRole = 'customer';

    const mockBuy = {
      id: mockBuyId,
      customerId: mockUserId,
      deliverymanId: null,
      status: 'cart',
    };

    getBuyByIdService.mockResolvedValueOnce(mockBuy);

    const mockReq = {
      params: { id: mockBuyId },
      body: { hour: 'invalidTime' },
      user: { id: mockUserId, role: mockUserRole },
    };


    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateBuyById(mockReq, mockRes);

    expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
    expect(updateStatusService).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'The time you have entered is incorrect, please enter a valid time (format: hour:min)',
    });
  });

  it('should return status 422 for cart with no foods in stock', async () => {
    const mockBuyId = 'exampleBuyId';
    const mockUserId = 123;
    const mockUserRole = 'customer';

    const mockBuy = {
      id: mockBuyId,
      customerId: mockUserId,
      deliverymanId: null,
      status: 'cart',
    };

    getBuyByIdService.mockResolvedValueOnce(mockBuy);

    const mockReq = {
      params: { id: mockBuyId },
      body: { hour: '12:30' },
      user: { id: mockUserId, role: mockUserRole },
    };

    updateStatusService.mockResolvedValueOnce('noFoods');

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateBuyById(mockReq, mockRes);

    expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
    expect(updateStatusService).toHaveBeenCalledWith(mockBuyId, '12:30');
    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'No more food in stock',
    });
  });

  it('should return status 422 for cart with no available deliverymen', async () => {
    const mockBuyId = 'exampleBuyId';
    const mockUserId = 123;
    const mockUserRole = 'customer';

    const mockBuy = {
      id: mockBuyId,
      customerId: mockUserId,
      deliverymanId: null,
      status: 'cart',
    };

    getBuyByIdService.mockResolvedValueOnce(mockBuy);

    const mockReq = {
      params: { id: mockBuyId },
      body: { hour: '12:30' },
      user: { id: mockUserId, role: mockUserRole },
    };

    updateStatusService.mockResolvedValueOnce('noDeliverymen');

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateBuyById(mockReq, mockRes);

    expect(getBuyByIdService).toHaveBeenCalledWith(mockBuyId);
    expect(updateStatusService).toHaveBeenCalledWith(mockBuyId, '12:30');
    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'No deliverymen available, please change delivery hour or order later',
    });
  });



});