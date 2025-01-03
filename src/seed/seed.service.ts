import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response-interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  // ExecuteSeed 2
  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const PokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      PokemonToInsert.push({ name:name, no:no });
    });

    await this.pokemonModel.insertMany(PokemonToInsert);
    return 'Seed executed';
  }

  // ExecuteSeed 1
  // async executeSeed() {
  //   await this.pokemonModel.deleteMany({});

  //   const { data } = await this.axios.get<PokeResponse>(
  //     'https://pokeapi.co/api/v2/pokemon?limit=10',
  //   );

  //   const insertPromisesArray = [];

  //   data.results.forEach(({ name, url }) => {
  //     const segments = url.split('/');
  //     const no: number = +segments[segments.length - 2];

  //     // const pokemon = await this.pokemonModel.create({name,no});
  //     insertPromisesArray.push(this.pokemonModel.create({ name, no }));
  //   });

  //   await Promise.all(insertPromisesArray);
  //   return 'Seed executed';
  // }
}
