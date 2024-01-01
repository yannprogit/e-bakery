///////////////// IMPORT ALL THE FUNCTIONS ////////////////
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../models/index');
const { login,authMiddleware, checkAuthorizationHeader} = require('../../controllers/loginController');
const { getRoleService } = require('../../services/employeesService.js');

///////////////// MOCKING THE SERVICES ////////////////
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('../../models/index', () => ({
  customers: {
    findOne: jest.fn(),
  },
  employees: {
    findOne: jest.fn(),
  },
}));

const mockNext = jest.fn();
const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(),
};

///////////////// GLOBAL CONTROLLER ////////////////
///////////////// LOGIN ////////////////
describe('Login', () => {
  it('should login successfully and return a token', async () => {
    const mockReq = {
      body: {
        mail: 'test@example.com',
        password: 'password123',
        role: 'customer',
      },
    };

    const mockCustomer = {
      id: 1,
      mail: 'test@example.com',
      password: 'hashedPassword123',
    };

    db.customers.findOne.mockResolvedValue(mockCustomer);

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue('mockedToken');

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, token: 'mockedToken', role: 'customer' });
  });

  it('should return a 404 status when user is not found', async () => {
    const mockReq = {
      body: {
        mail: 'nonexistent@example.com',
        password: 'password123',
        role: 'customer',
      },
    };

    db.customers.findOne.mockResolvedValue(null);

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "This user doesn't exists" });
  });

  it('should return a 401 status when password is incorrect', async () => {
    const mockReq = {
      body: {
        mail: 'test@example.com',
        password: 'incorrectPassword',
        role: 'customer',
      },
    };

    const mockCustomer = {
      id: 1,
      mail: 'test@example.com',
      password: 'hashedPassword123',
    };

    db.customers.findOne.mockResolvedValue(mockCustomer);

    bcrypt.compare.mockResolvedValue(false);

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Password is incorrect' });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

});
  

///////////////// AUTHMIDDLEWARE ////////////////
describe('authMiddleware', () => {
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      beforeEach(() => {
          jest.clearAllMocks();
      });

      it('should call next() if valid token is present in the header', async () => {
          const req = { header: jest.fn(() => 'validToken') };
  
          jwt.verify.mockImplementationOnce((token, secret, callback) => {
              callback(null, { role: 'admin' });
          });
  
          await authMiddleware(['admin'])(req, mockRes, mockNext);
  
          expect(req.header).toHaveBeenCalledWith('Authorization');
          expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.secretKey, expect.any(Function));
          expect(mockNext).toHaveBeenCalled();
          expect(mockRes.status).not.toHaveBeenCalled();
          expect(mockRes.json).not.toHaveBeenCalled();
      });
  
      it('should return 403 if token is invalid', async () => {
          const req = { header: jest.fn(() => 'invalidToken') };
  
          jwt.verify.mockImplementationOnce((token, secret, callback) => {
              callback('TokenError');
          });

          await authMiddleware(['admin'])(req, mockRes, mockNext);
  
          expect(req.header).toHaveBeenCalledWith('Authorization');
          expect(jwt.verify).toHaveBeenCalledWith('invalidToken', process.env.secretKey, expect.any(Function));
          expect(mockNext).not.toHaveBeenCalled();
          expect(mockRes.status).toHaveBeenCalledWith(403);
          expect(mockRes.json).toHaveBeenCalledWith({
              success: false,
              message: 'Access forbidden: The token is invalid',
          });
      });

      /*it('should return 401 if no token is present in the header', async () => {
        const req = { };

        await authMiddleware(['admin'])(req, mockRes, mockNext);

        expect(req.headers).toBeDefined();
        expect(req.headers.authorization).toBeUndefined();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: 'Access forbidden: You must be logged in to do this',
        });
    });

    /*it('should return 403 if user role is not allowed', async () => {
        // Mock req with a valid token
        const req = { header: jest.fn(() => 'validToken') };
  
        jwt.verify.mockImplementationOnce((token, secret, callback) => {
            callback(null, { role: 'user' });
        });
  
        await authMiddleware(['admin'])(req, mockRes, mockNext);
  
        // Assertions
        expect(req.headers).toBeDefined();
        expect(req.headers.authorization).toBe('validToken');
        expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.secretKey, expect.any(Function));
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: 'Access forbidden: You are not allowed to do that with your role',
        });
    });*/
      
});


  

