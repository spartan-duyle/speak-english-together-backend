import { Module } from '@nestjs/common';
import CometchatService from '@/modules/externals/cometchat/cometchat.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CometchatService],
  exports: [CometchatService],
})
export class CometchatModule {}
