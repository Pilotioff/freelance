import { Module } from '@nestjs/common';
import { MarketComparisonController } from './market-comparison.controller';
import { MarketComparisonService } from './market-comparison.service';
import { MockMarketDataProvider } from './mock-market-data.provider';
import { MARKET_DATA_PROVIDER } from './market-data.interface';

@Module({
  controllers: [MarketComparisonController],
  providers: [
    MarketComparisonService,
    { provide: MARKET_DATA_PROVIDER, useClass: MockMarketDataProvider },
  ],
  exports: [MarketComparisonService],
})
export class MarketComparisonModule {}
