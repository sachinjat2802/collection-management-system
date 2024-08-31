import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { DataImportService } from './services/data-import.service';
import { CasesService } from './services/cases.service';
import { DataImportJob } from './jobs/data-import.job';
import { CasesController } from './controllers/cases.controller';
import { Case, CaseSchema } from './schemas/cases.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Case.name, schema: CaseSchema }]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [CasesController],
  providers: [DataImportService, CasesService, DataImportJob],
})
export class AppModule {}