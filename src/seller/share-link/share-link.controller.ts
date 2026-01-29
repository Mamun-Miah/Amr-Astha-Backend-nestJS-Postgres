import { Controller } from '@nestjs/common';
import { ShareLinkService } from './share-link.service';

@Controller('share-link')
export class ShareLinkController {
  constructor(private readonly shareLinkService: ShareLinkService) {}
}
