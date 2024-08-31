import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Case } from '../schemas/cases.schema';
import * as csv from 'csv-parser';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Readable } from 'stream';

@Injectable()
export class DataImportService {
  private readonly logger = new Logger(DataImportService.name);
  private readonly fileUrl: string;

  constructor(
    @InjectModel(Case.name) private caseModel: Model<Case>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.fileUrl = this.configService.get<string>('GOOGLE_DRIVE_FILE_URL');
  }

  async importData(): Promise<void> {
    const results = [];

    try {
      const fileId = this.extractFileId(this.fileUrl);
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      
      // Fetch the file
      const response = await lastValueFrom(
        this.httpService.get(downloadUrl, { responseType: 'stream' }),
      );

      const stream = response.data as Readable;

      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            await this.bulkInsertIfNotExists(results);
            this.logger.log('Data import completed with skipping existing records.');
          } catch (error) {
            this.logger.error('Error importing data', error);
          }
        });
    } catch (error) {
        console.log('Error fetching CSV file', error);
      this.logger.error('Error fetching CSV file', error);
    }
  }

  private extractFileId(url: string): string {
    const match = url.match(/[-\w]{25,}/); // Google Drive file ID regex
    if (match) {
      return match[0];
    } else {
      this.logger.error('Invalid Google Drive URL format');
      throw new Error('Invalid Google Drive URL format');
    }
  }

  private async bulkInsertIfNotExists(records: any[]): Promise<void> {
    if (!records.length) return;

    // Create bulk operations for each record
    const bulkOps = records.map((record) => {
      // Generate a filter object that matches all fields in the record
      const filter = { ...record };

      return {
        updateOne: {
          filter,                              // Match the entire record
          update: { $setOnInsert: record },     // Insert only if not exists
          upsert: true,                         // Upsert option for the operation
        },
      };
    });

    try {
      const result = await this.caseModel.bulkWrite(bulkOps, { ordered: false });
      this.logger.log(`Inserted ${result.upsertedCount} new records.`);
    } catch (error) {
      this.logger.error('Error performing bulk insert', error);
    }
  }
}
