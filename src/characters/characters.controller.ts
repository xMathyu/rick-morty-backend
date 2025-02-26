import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import {
  CharacterFilter,
  Character,
} from './../interfaces/rick-and-morty.interface';

/**
 * Controller that exposes endpoints for:
 *  - Fetching data from the external Rick & Morty API (GET /characters/external)
 *  - CRUD operations on Firestore: POST/GET/PATCH/DELETE /characters
 */
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  /**
   * GET /characters/external
   * Example: /characters/external?name=rick&page=2
   * Calls the external Rick & Morty API with filters and pagination options.
   */
  @Get('external')
  async getExternalCharacters(@Query() filter: CharacterFilter) {
    return this.charactersService.fetchCharactersFromApi(filter);
  }

  /**
   * GET /characters/locations
   * Calls the external Rick & Morty API to fetch all locations.
   */
  @Get('locations')
  async getLocations() {
    return this.charactersService.fetchLocationsFromApi();
  }

  /**
   * POST /characters
   * Creates a custom character in Firestore.
   */
  @Post()
  async create(@Body() data: Partial<Character>) {
    return this.charactersService.createCharacterInFirestore(data);
  }

  /**
   * GET /characters
   * Retrieves all characters stored in Firestore.
   */
  @Get()
  async findAll() {
    return this.charactersService.getAllCharactersFromFirestore();
  }

  /**
   * GET /characters/:id
   * Retrieves a character by its Firestore ID.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.charactersService.getCharacterByIdFromFirestore(id);
  }

  /**
   * PATCH /characters/:id
   * Updates a character by its Firestore ID.
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Character>) {
    return this.charactersService.updateCharacterInFirestore(id, data);
  }

  /**
   * DELETE /characters/:id
   * Deletes a character by its Firestore ID.
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.charactersService.deleteCharacterFromFirestore(id);
  }
}
