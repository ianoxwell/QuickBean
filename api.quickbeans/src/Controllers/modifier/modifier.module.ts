import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModifierController } from './modifier.controller';
import { Modifier, ModifierOption } from './Modifier.entity';
import { ModifierService } from './modifier.service';

@Module({
  imports: [TypeOrmModule.forFeature([Modifier, ModifierOption])],
  providers: [ModifierService],
  controllers: [ModifierController],
  exports: [ModifierService]
})
export class ModifierModule {}
