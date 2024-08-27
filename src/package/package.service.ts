import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { Repository } from 'typeorm';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    private readonly tagRepository: TagService,
  ) {}

  async create(createPackgeDto: CreatePackageDto) {
    const { tags } = createPackgeDto;

    const tagObjs = await Promise.all(
      tags.map(async (tag) => {
        if (isNaN(tag as any)) {
          return await this.tagRepository.create({ name: tag });
        } else {
          const val = await this.tagRepository.findOne(tag as any);

          if (!val) {
            return await this.tagRepository.create({ name: tag });
          }
          return val;
        }
      }),
    );

    const pkg = this.packageRepository.create({
      ...createPackgeDto,
      tags: tagObjs,
    });

    return await this.packageRepository.save(pkg);
  }

  async findAll() {
    return await this.packageRepository.find();
  }

  async findOne(id: number) {
    return await this.packageRepository.findOne({
      where: { id },
      relations: {
        tags: true,
      },
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
