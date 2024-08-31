import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Case } from '../schemas/cases.schema';

@Injectable()
export class CasesService {
  constructor(@InjectModel(Case.name) private caseModel: Model<Case>) {}

  async getAggregatedData(startDate: string, endDate: string) {
    const match = {};
    if (startDate && endDate) {
      match['CreatedAt'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    return this.caseModel.aggregate([
      { $match: match },
      { $group: { _id: '$city', totalCases: { $sum: 1 } } },
    ]);
  }
}
