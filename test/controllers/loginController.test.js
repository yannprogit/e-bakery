const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../models/index');
const { login } = require('../../controllers/loginController');

// Mocking the bcrypt.compare function
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

// Mocking the jwt.sign function
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// Mocking the db.customers and db.employees models
jest.mock('../../models/index', () => ({
  customers: {
    findOne: jest.fn(),
  },
  employees: {
    findOne: jest.fn(),
  },
}));

describe('Auth Controller - Login', () => {
  it('should login successfully and return a token', async () => {
    // Mock data for the request
    const mockReq = {
      body: {
        mail: 'test@example.com',
        password: 'password123',
        role: 'customer',
      },
    };

    // Mock data for the customer
    const mockCustomer = {
      id: 1,
      mail: 'test@example.com',
      password: 'hashedPassword123',
    };

    // Mock the behavior of the db.customers.findOne function
    db.customers.findOne.mockResolvedValue(mockCustomer);

    // Mock the behavior of the bcrypt.compare function
    bcrypt.compare.mockResolvedValue(true);

    // Mock the behavior of the jwt.sign function
    jwt.sign.mockReturnValue('mockedToken');

    // Mock Express response object
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the login method
    await login(mockReq, mockRes);

    // Verify that the response status and JSON are as expected
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, token: 'mockedToken', role: 'customer' });
  });

});

describe('Auth Controller - Login', () => {
    // Previous test case...
  
    it('should return a 404 status when user is not found', async () => {
      // Mock data for the request
      const mockReq = {
        body: {
          mail: 'nonexistent@example.com',
          password: 'password123',
          role: 'customer',
        },
      };
  
      // Mock the behavior of the db.customers.findOne function
      db.customers.findOne.mockResolvedValue(null);
  
      // Mock Express response object
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Call the login method
      await login(mockReq, mockRes);
  
      // Verify that the response status and JSON are as expected
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This user doesn't exists" });
    });
  
    it('should return a 401 status when password is incorrect', async () => {
      // Mock data for the request
      const mockReq = {
        body: {
          mail: 'test@example.com',
          password: 'incorrectPassword',
          role: 'customer',
        },
      };
  
      // Mock data for the customer
      const mockCustomer = {
        id: 1,
        mail: 'test@example.com',
        password: 'hashedPassword123',
      };
  
      // Mock the behavior of the db.customers.findOne function
      db.customers.findOne.mockResolvedValue(mockCustomer);
  
      // Mock the behavior of the bcrypt.compare function
      bcrypt.compare.mockResolvedValue(false);
  
      // Mock Express response object
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Call the login method
      await login(mockReq, mockRes);
  
      // Verify that the response status and JSON are as expected
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Password is incorrect' });
    });
  
    // Add more test cases for other scenarios...
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  });