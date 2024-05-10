import { Module } from '@nestjs/common';
import { VideoSDKService } from './videoSDK.service';

@Module({
  controllers: [],
  providers: [VideoSDKService],
  exports: [VideoSDKService],
})
export class VideoSDKModule {}
