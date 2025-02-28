/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import {
  CharacterFilter,
  Character,
} from './../interfaces/rick-and-morty.interface';

describe('CharactersController', () => {
  let controller: CharactersController;
  let service: CharactersService;

  const mockService: Partial<CharactersService> = {
    fetchCharactersFromApi: jest
      .fn()
      .mockImplementation((filter: CharacterFilter) =>
        Promise.resolve({ info: {}, results: [] }),
      ),
    fetchLocationsFromApi: jest
      .fn()
      .mockResolvedValue({ info: {}, results: [] }),
    createCharacterInFirestore: jest
      .fn()
      .mockImplementation((data: Partial<Character>) =>
        Promise.resolve({ ...data, id: '123' }),
      ),
    getAllCharactersFromFirestore: jest.fn().mockResolvedValue([]),
    getCharacterByIdFromFirestore: jest
      .fn()
      .mockResolvedValue({ id: '1', name: 'Rick' }),
    updateCharacterInFirestore: jest
      .fn()
      .mockImplementation((id: string, data: Partial<Character>) =>
        Promise.resolve({ id, ...data }),
      ),
    deleteCharacterFromFirestore: jest
      .fn()
      .mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [{ provide: CharactersService, useValue: mockService }],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
    service = module.get<CharactersService>(CharactersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getExternalCharacters', () => {
    it('should call service.fetchCharactersFromApi with query filters', async () => {
      const filter: CharacterFilter = { name: 'rick', page: 2 };
      const result = { info: { count: 1 }, results: [{ id: 1, name: 'Rick' }] };
      (mockService.fetchCharactersFromApi as jest.Mock).mockResolvedValue(
        result,
      );

      expect(await controller.getExternalCharacters(filter)).toBe(result);
      expect(service.fetchCharactersFromApi).toHaveBeenCalledWith(filter);
    });
  });

  describe('getLocations', () => {
    it('should call service.fetchLocationsFromApi', async () => {
      const result = {
        info: { count: 1 },
        results: [{ id: 1, name: 'Earth' }],
      };
      (mockService.fetchLocationsFromApi as jest.Mock).mockResolvedValue(
        result,
      );

      expect(await controller.getLocations()).toBe(result);
      expect(service.fetchLocationsFromApi).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should call service.createCharacterInFirestore with body data', async () => {
      const data: Partial<Character> = {
        name: 'Morty',
        status: 'Alive' as const,
      };
      const result = { ...data, id: '123' };
      (mockService.createCharacterInFirestore as jest.Mock).mockResolvedValue(
        result,
      );

      expect(await controller.create(data)).toBe(result);
      expect(service.createCharacterInFirestore).toHaveBeenCalledWith(data);
    });
  });

  describe('findAll', () => {
    it('should call service.getAllCharactersFromFirestore', async () => {
      const result = [{ id: '1', name: 'Rick' }];
      (
        mockService.getAllCharactersFromFirestore as jest.Mock
      ).mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.getAllCharactersFromFirestore).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.getCharacterByIdFromFirestore with id', async () => {
      const id = '1';
      const result = { id, name: 'Rick' };
      (
        mockService.getCharacterByIdFromFirestore as jest.Mock
      ).mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
      expect(service.getCharacterByIdFromFirestore).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call service.updateCharacterInFirestore with id and data', async () => {
      const id = '1';
      const data: Partial<Character> = { status: 'Dead' as const };
      const result = { id, name: 'Rick', status: 'Dead' };
      (mockService.updateCharacterInFirestore as jest.Mock).mockResolvedValue(
        result,
      );

      expect(await controller.update(id, data)).toBe(result);
      expect(service.updateCharacterInFirestore).toHaveBeenCalledWith(id, data);
    });
  });

  describe('remove', () => {
    it('should call service.deleteCharacterFromFirestore with id', async () => {
      const id = '1';
      const result = { success: true };
      (mockService.deleteCharacterFromFirestore as jest.Mock).mockResolvedValue(
        result,
      );

      expect(await controller.remove(id)).toBe(result);
      expect(service.deleteCharacterFromFirestore).toHaveBeenCalledWith(id);
    });
  });
});
