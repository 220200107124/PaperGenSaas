import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UsersModule } from '../users/users.module';
import { SchoolsModule } from '../schools/schools.module';

@Module({
  imports: [UsersModule, SchoolsModule],
  providers: [SeederService],
})
export class SeedModule {}
