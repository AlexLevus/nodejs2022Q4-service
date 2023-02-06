import { Module, Global } from '@nestjs/common';
import InMemoryDb from './in-memory-db.entity';

@Global()
@Module({
  controllers: [],
  providers: [InMemoryDb],
  exports: [InMemoryDb],
})
export class InMemoryDbModule {}
