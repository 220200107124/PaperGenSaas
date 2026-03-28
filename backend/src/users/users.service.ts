import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-users.dto';
import { User } from './entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationResponse } from '../common/utils/pagination.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: any): Promise<User> {
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: createUserDto.password || '123456',
    });
    return await this.usersRepository.save(newUser as any);
  }

  async findAll(paginationDto: PaginationDto & { role?: any, schoolId?: string, status?: string }): Promise<any> {
    const { page = 1, limit = 10, search, sortBy, order = 'ASC', role, schoolId, status } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (schoolId) {
      queryBuilder.andWhere('user.schoolId = :schoolId', { schoolId });
    }

    if (search) {
      queryBuilder.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      queryBuilder.orderBy(`user.${sortBy}`, order as any);
    } else {
      queryBuilder.orderBy('user.createdAt', 'DESC');
    }

    const [data, totalRecords] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return createPaginationResponse(data, totalRecords, page, limit);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email }, relations: { school: true } });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { verificationToken: token } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id }, relations: { school: true } });
  }

  async update(id: string, updateData: any): Promise<User | null> {
    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

