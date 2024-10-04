import { Role } from 'src/user/entities/user.entity';

interface JwtPayload {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: Role;
}
