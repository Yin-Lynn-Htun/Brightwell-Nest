import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from '../user/user.service'; // Adjust the path as needed

import { Gender, Relationship, Role } from 'src/user/entities/user.entity';
import { RoomTypeService } from 'src/room-type/room-type.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private userService: UserService,
    private RoomTypeService: RoomTypeService,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
    await this.seedDoctorRoomType();
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@gmail.com';
    const adminExists = await this.userService.findByEmail(adminEmail);

    if (!adminExists) {
      await this.userService.create({
        firstName: 'Admin',
        lastName: 'One',
        phoneNumber: '+14185438090',
        email: adminEmail,
        role: Role.Admin, // Admin role
        gender: Gender.Male,
        address:
          '70 Washington Square South, New York, NY 10012, United States',
        city: 'New York',
        province: 'NY',
        postalCode: '10012',
        country: 'United States',
        eFirstName: 'Admin',
        eLastName: 'User',
        eMobileNumber: '+14185438090',
        eEmail: 'admin@example.com',
        eRelationship: Relationship.Family,
        dob: '1980-01-01', // Changed to date string
        description: '<p>This is the system admin</p>',
        nationality: 'American',
      });
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  }

  private async seedDoctorRoomType() {
    const name = 'Doctor consulation room';
    const roomExists = await this.RoomTypeService.findByName(name);
    if (!roomExists) {
      await this.RoomTypeService.create({
        name: name,
        description: '',
        images: [],
        charges: [],
        amenities: [],
      });
    } else {
      console.log('room already exists.');
    }
  }
}
