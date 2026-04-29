import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/users.entity';
import { SchoolsService } from '../schools/schools.service';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly schoolsService: SchoolsService,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    this.logger.log('Starting seeding process...');

    // 1. Seed Super Admin
    const adminEmail = 'admin@papergen.com';
    const existingAdmin = await this.usersService.findByEmail(adminEmail);

    if (!existingAdmin) {
      await this.usersService.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'admin123',
        role: UserRole.SUPER_ADMIN,
      });
      this.logger.log(`Super Admin created: ${adminEmail} / admin123`);
    } else {
      this.logger.log('Super Admin already exists.');
    }

    // 2. Seed a Sample School if none exist
    const schoolsRes = await this.schoolsService.findAll({});
    if (schoolsRes.data.length === 0) {
      const sampleSchool = await this.schoolsService.create({
        name: 'Sample High School',
        address: '123 Education Lane',
        subscriptionPlan: 'PREMIUM',
      });
      this.logger.log(`Sample School created: ${sampleSchool.name} (ID: ${sampleSchool.id})`);

      // 3. Seed a School Admin for this school
      const schoolAdminEmail = 'school@papergen.com';
      await this.usersService.create({
        name: 'School Principal',
        email: schoolAdminEmail,
        password: 'school123',
        role: UserRole.SCHOOL_ADMIN,
        schoolId: sampleSchool.id,
      });
      this.logger.log(`School Admin created: ${schoolAdminEmail} / school123`);
    }
    // 4. Seed a Teacher if none exist
    const teacherEmail = 'teacher@papergen.com';
    const existingTeacher = await this.usersService.findByEmail(teacherEmail);
    if (!existingTeacher) {
      const schoolsForTeacherRes = await this.schoolsService.findAll({});
      if (schoolsForTeacherRes.data.length > 0) {
        await this.usersService.create({
          name: 'Demo Teacher',
          email: teacherEmail,
          password: 'teacher123',
          role: UserRole.TEACHER,
          schoolId: schoolsForTeacherRes.data[0].id,
        });
        this.logger.log(`Teacher created: ${teacherEmail} / teacher123`);
      } else {
        this.logger.log('Could not create Teacher because no School exists.');
      }
    } else {
      this.logger.log('Teacher already exists.');
    }

    this.logger.log('Seeding completed.');
  }
}
