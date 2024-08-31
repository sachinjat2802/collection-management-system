import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataImportService } from '../services/data-import.service';

@Injectable()
export class DataImportJob {
  constructor(private readonly dataImportService: DataImportService) {}

  @Cron('0 10,17 * * *')
  handleCron() {
    console.log('Data import job started');
    this.dataImportService.importData();
  }
}