import { UserRole } from '../entities/users.entity';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  schoolId?: string;
}
