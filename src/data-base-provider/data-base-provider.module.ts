import { Module } from '@nestjs/common';
import { DataBaseProvider } from './data-base-provider';

@Module({
  providers: [...DataBaseProvider],
  exports: [...DataBaseProvider]
})
export class DataBaseProviderModule {}
