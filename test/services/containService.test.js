const { 
    getCompositions, 
    addContain, 
    getSpecificCompositions, 
    deleteContain, 
    replaceIngredientOfFood, 
    getContainByIds 
  } = require('../../services/containService.js');
  const db = require('../../models/index.js');
  
  jest.mock('../../models/index.js', () => ({
    contain: {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      findOne: jest.fn(),
    },
  }));
  
  describe('Contain Service', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should get compositions', async () => {
      // Mock the behavior of the db.contain.findAll function
      const mockCompositions = [{ foodId: 1, ingredientId: 1 }, { foodId: 2, ingredientId: 2 }];
      db.contain.findAll.mockResolvedValue(mockCompositions);
  
      // Call the getCompositions method
      const result = await getCompositions();
  
      // Verify that the result is as expected
      expect(result).toEqual(mockCompositions);
    });
  
    it('should add a composition', async () => {
      // Mock the behavior of the db.contain.create function
      const mockComposition = { foodId: 1, ingredientId: 1 };
      db.contain.create.mockResolvedValue(mockComposition);
  
      // Call the addContain method
      const result = await addContain(1, 1);
  
      // Verify that the result is as expected
      expect(result).toEqual(mockComposition);
    });
  
    it('should get specific compositions by food id', async () => {
      // Mock the behavior of the db.contain.findAll function
      const mockCompositions = [{ foodId: 1, ingredientId: 1 }, { foodId: 1, ingredientId: 2 }];
      db.contain.findAll.mockResolvedValue(mockCompositions);
  
      // Call the getSpecificCompositions method
      const result = await getSpecificCompositions(1, 'food');
  
      // Verify that the result is as expected
      expect(result).toEqual(mockCompositions);
    });
  
    it('should get specific compositions by ingredient id', async () => {
        // Mock the behavior of the db.contain.findAll function
        const mockCompositions = [{ foodId: 1, ingredientId: 1 }, { foodId: 2, ingredientId: 1 }];
        db.contain.findAll.mockResolvedValue(mockCompositions);
    
        // Call the getSpecificCompositions method
        const result = await getSpecificCompositions(1, 'ingredient');
    
        // Verify that the result is as expected
        expect(result).toEqual(mockCompositions);
      });
    
      it('should not get specific compositions for an invalid type', async () => {
        // Call the getSpecificCompositions method with an invalid type
        const result = await getSpecificCompositions(1, 'invalidType');
    
        // Verify that the result is false
        expect(result).toBe(false);
      });
    
      it('should delete a composition', async () => {
        // Mock the behavior of the db.contain.destroy function
        db.contain.destroy.mockResolvedValue(1); // 1 row affected (deleted)
    
        // Call the deleteContain method
        const result = await deleteContain(1, 1);
    
        // Verify that the result is as expected
        expect(result).toBe(1);
      });
    
      it('should replace an ingredient of a food', async () => {
        // Mock the behavior of the db.contain.update function
        db.contain.update.mockResolvedValue([1]); // 1 row affected (updated)
    
        // Call the replaceIngredientOfFood method
        const result = await replaceIngredientOfFood(1, 1, 2);
    
        // Verify that the result is as expected
        expect(result[0]).toBe(1);
      });
    
      it('should get a composition by its foodId and ingredientId', async () => {
        // Mock the behavior of the db.contain.findOne function
        const mockComposition = { foodId: 1, ingredientId: 1 };
        db.contain.findOne.mockResolvedValue(mockComposition);
    
        // Call the getContainByIds method
        const result = await getContainByIds(1, 1);
    
        // Verify that the result is as expected
        expect(result).toEqual(mockComposition);
      });
    
});