import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRespository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const city = this.citiesRespository.create(createCityDto);

    return await this.citiesRespository.save(city);
  }

  async findAll() {
    const cities = await this.citiesRespository.find();
    return cities;
  }

  async findOne(id: number) {
    return await this.citiesRespository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id);

    if (!city) {
      throw new NotFoundException();
    }

    Object.assign(city, updateCityDto);

    return await this.citiesRespository.save(city);
  }

  async remove(id: number) {
    const city = await this.findOne(id);

    if (!city) {
      throw new NotFoundException();
    }

    return await this.citiesRespository.remove(city);
  }
}
