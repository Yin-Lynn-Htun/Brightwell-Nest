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

    const data = await this.packageRepository.save(pkg);
    return { ...data, responseMessage: 'Package is created successfully.' };
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

    const { tags } = updatePackageDto;
    let tagObjs: any[] = [];

    if (tags?.length) {
      tagObjs = await Promise.all(
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
    }

    Object.assign(pkg, { ...updatePackageDto, tags: tagObjs });

    const data = await this.packageRepository.save(pkg);
    return {
      ...data,
      responseMessage: 'Updated medical package successfully.',
    };
  }

  async remove(id: number) {
    const pkg = await this.findOne(id);

    if (!pkg) {
      throw new NotFoundException();
    }

    const data = await this.packageRepository.remove(pkg);
    return {
      ...data,
      responseMessage: 'Deleted medical package successfully.',
    };
  }
}
