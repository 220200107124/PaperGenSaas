import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { StandardsModule } from './standards/standards.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ChaptersModule } from './chapters/chapters.module';
import { QuestionsModule } from './questions/questions.module';
import { PapersModule } from './papers/papers.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { SeedModule } from './seed/seed.module';
import { SchoolRequestsModule } from './school-requests/school-requests.module';
import { TeachersModule } from './teachers/teachers.module';
import { MailModule } from './mail/mail.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        const nodeEnv = configService.get<string>('NODE_ENV');
        const isProd = nodeEnv === 'production';

        if (url) {
          return {
            type: 'postgres',
            url,
            autoLoadEntities: true,
            synchronize: configService.get<string>('DB_SYNC') === 'true' || !isProd,
            ssl: isProd ? { rejectUnauthorized: false } : false,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: configService.get<string>('DB_SYNC') === 'true' || !isProd,
          logging: !isProd,
          ssl: isProd ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    AuthModule,
    UsersModule,
    SchoolsModule,
    StandardsModule,
    SubjectsModule,
    ChaptersModule,
    QuestionsModule,
    PapersModule,
    SubscriptionsModule,
    SuperAdminModule,
    SeedModule,
    SchoolRequestsModule,
    TeachersModule,
    MailModule,
    PaymentsModule,
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
