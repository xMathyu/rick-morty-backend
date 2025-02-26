import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import axios from 'axios';
import {
  Character,
  Info,
  CharacterFilter,
  Location,
} from './../interfaces/rick-and-morty.interface';

/**
 * CharactersService integrates:
 *  - Firestore CRUD operations (create, read, update, delete characters)
 *  - Consumption of the external Rick and Morty API (searches, pagination, etc.)
 */
@Injectable()
export class CharactersService {
  private readonly db: admin.firestore.Firestore;
  private readonly baseUrl = `${process.env.API_URL}/character`;

  constructor() {
    this.db = admin.firestore();
  }

  /**
   * 1. FETCH EXTERNAL DATA (Rick and Morty API)
   *    Allows searching external characters with filters and pagination
   */
  async fetchCharactersFromApi(
    filter: CharacterFilter = {},
  ): Promise<Info<Character[]>> {
    let url = this.baseUrl;
    const queryParams = new URLSearchParams();

    if (filter.page) queryParams.append('page', String(filter.page));
    if (filter.name) queryParams.append('name', filter.name);
    if (filter.status) queryParams.append('status', filter.status);
    if (filter.species) queryParams.append('species', filter.species);
    if (filter.type) queryParams.append('type', filter.type);
    if (filter.gender) queryParams.append('gender', filter.gender);

    if ([...queryParams.keys()].length > 0) {
      url += `?${queryParams.toString()}`;
    }

    try {
      const { data } = await axios.get<Info<Character[]>>(url);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return { info: undefined, results: [] };
        }
        throw new InternalServerErrorException(
          `Error fetching characters: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Fetch all locations from the external Rick and Morty API
   */
  async fetchLocationsFromApi(): Promise<Info<Location[]>> {
    const url = `${process.env.API_URL}/location`;
    try {
      const { data } = await axios.get<Info<Location[]>>(url);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return { info: undefined, results: [] };
        }
        throw new InternalServerErrorException(
          `Error fetching locations: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * 2. CREATE: Create a custom character in Firestore
   */
  async createCharacterInFirestore(
    data: Partial<Character>,
  ): Promise<Character> {
    const docRef = await this.db.collection('characters').add(data);

    const newChar: Character = {
      ...data,
      id: docRef.id, // Firestore returns id as a string
      url: '',
      created: new Date().toISOString(),
      name: data.name || 'Unknown',
      status: data.status || 'unknown',
      species: data.species || '',
      type: data.type || '',
      gender: data.gender || 'unknown',
      origin: data.origin || { name: '', url: '' },
      location: data.location || { name: '', url: '' },
      image: data.image || '',
      episode: data.episode || [],
    };

    return newChar;
  }

  /**
   * 3. READ: Get all characters from Firestore
   */
  async getAllCharactersFromFirestore(): Promise<Character[]> {
    const snapshot = await this.db.collection('characters').get();
    return snapshot.docs.map((doc) => {
      const data = doc.data() as Partial<Character>;
      return {
        ...data,
        id: doc.id, // Firestore document id
      } as Character;
    });
  }

  /**
   * READ (by ID)
   */
  async getCharacterByIdFromFirestore(id: string): Promise<Character> {
    const docRef = this.db.collection('characters').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException(
        `Character with ID "${id}" not found in Firestore`,
      );
    }
    // docSnap.data() returns an object with partial fields,
    // id is a string, which fits with "id: string | number"
    return { ...docSnap.data(), id: docSnap.id } as Character;
  }

  /**
   * 4. UPDATE: Modify a character in Firestore
   */
  async updateCharacterInFirestore(
    id: string,
    data: Partial<Character>,
  ): Promise<Character> {
    const docRef = this.db.collection('characters').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException(
        `Character with ID "${id}" not found in Firestore`,
      );
    }
    await docRef.update(data);

    // Merge previous data with new fields + id
    return {
      ...docSnap.data(),
      ...data,
      id: docSnap.id,
    } as Character;
  }

  /**
   * 5. DELETE: Delete a character from Firestore
   */
  async deleteCharacterFromFirestore(
    id: string,
  ): Promise<{ success: boolean }> {
    const docRef = this.db.collection('characters').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException(
        `Character with ID "${id}" not found in Firestore`,
      );
    }
    await docRef.delete();
    return { success: true };
  }
}
