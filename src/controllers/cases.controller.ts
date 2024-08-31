import { Controller, Get, Query } from '@nestjs/common';
import { CasesService } from '../services/cases.service';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get('aggregate')
  async getAggregatedData(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.casesService.getAggregatedData(startDate, endDate);
  }
}
