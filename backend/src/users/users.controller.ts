import { Controller, Get, Post, Body, UseGuards, ForbiddenException, Query, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './entities/users.entity';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  async create(@Body() createUserDto: CreateUserDto, @GetUser() currentUser: any) {
    if (currentUser.role === UserRole.SCHOOL_ADMIN) {
      if (createUserDto.role !== UserRole.TEACHER) {
        throw new ForbiddenException('School Admins can only create Teacher accounts');
      }
      if (createUserDto.schoolId !== currentUser.schoolId) {
        throw new ForbiddenException('You can only add teachers to your own school');
      }
    }
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      success: true,
      data: user,
    };
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  async findAll(@Query() paginationDto: any) {
    return await this.usersService.findAll(paginationDto);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateData: any) {
    const user = await this.usersService.update(id, updateData);
    return {
      success: true,
      message: 'User updated successfully',
      data: user,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return {
      success: true,
      message: 'User removed successfully',
    };
  }
}
