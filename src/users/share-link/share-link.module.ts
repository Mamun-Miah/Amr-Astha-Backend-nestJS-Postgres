import { Module } from '@nestjs/common';
import { ShareLinkService } from './share-link.service';
import { ShareLinkController } from './share-link.controller';

@Module({
  controllers: [ShareLinkController],
  providers: [ShareLinkService],
})
export class ShareLinkModule {}
