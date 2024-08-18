import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
  ) {}

  @Post()
  async create(@Body() createPackgeDto: CreatePackageDto) {
    const pkg = this.packageRepository.create(createPackgeDto);

    return await this.packageRepository.save(pkg);
  }

  async findAll() {
    return await this.packageRepository.find();
  }

  async findOne(id: number) {
    return await this.packageRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const pkg = await this.packageRepository.findOne({
      where: { id },
    });

    if (!pkg) {
      throw new NotFoundException();
    }

    Object.assign(pkg, updatePackageDto);
    return await this.packageRepository.save(pkg);
  }

  async remove(id: number) {
    const pkg = await this.findOne(id);

    if (!pkg) {
      throw new NotFoundException();
    }

    return await this.packageRepository.remove(pkg);
  }
}
