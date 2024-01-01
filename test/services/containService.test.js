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
      const mockCompositions = [{ foodId: 1, ingredientId: 1 }, { foodId: 2, ingredientId: 2 }];
      db.contain.findAll.mockResolvedValue(mockCompositions);
  
      const result = await getCompositions();
  
      expect(result).toEqual(mockCompositions);
    });
  
    it('should add a composition', async () => {
      const mockComposition = { foodId: 1, ingredientId: 1 };
      db.contain.create.mockResolvedValue(mockComposition);
  
      const result = await addContain(1, 1);
  
      expect(result).toEqual(mockComposition);
    });
  
    it('should get specific compositions by food id', async () => {

      const mockCompositions = [{ foodId: 1, ingredientId: 1 }, { foodId: 1, ingredientId: 2 }];
      db.contain.findAll.mockResolvedValue(mockCompositions);
  
      const result = await getSpecificCompositions(1, 'food');
  
      expect(result).toEqual(mockCompositions);
    });
  
    it('should get specific compositions by ingredient id', async () => {

      const mockCompositions = [{ foodId: 1, ingredientId: 1 }, { foodId: 2, ingredientId: 1 }];
        db.contain.findAll.mockResolvedValue(mockCompositions);
    
        const result = await getSpecificCompositions(1, 'ingredient');
    
        expect(result).toEqual(mockCompositions);
      });
    
      it('should not get specific compositions for an invalid type', async () => {
        const result = await getSpecificCompositions(1, 'invalidType');
    
        expect(result).toBe(false);
      });
    
      it('should delete a composition', async () => {
        db.contain.destroy.mockResolvedValue(1); 
    
        const result = await deleteContain(1, 1);
    
        expect(result).toBe(1);
      });
    
      it('should replace an ingredient of a food', async () => {
        db.contain.update.mockResolvedValue([1]); 

        const result = await replaceIngredientOfFood(1, 1, 2);
    
        expect(result[0]).toBe(1);
      });
    
      it('should get a composition by its foodId and ingredientId', async () => {
        const mockComposition = { foodId: 1, ingredientId: 1 };
        db.contain.findOne.mockResolvedValue(mockComposition);
    
        const result = await getContainByIds(1, 1);
    
        expect(result).toEqual(mockComposition);
      });
    
});