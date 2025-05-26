import { CMessage } from '@base/message.class';
import { IModifier } from '@models/modifier.dto';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModifierService } from './modifier.service';

@ApiTags('Modifier')
@Controller('modifier')
export class ModifierController {
  constructor(private readonly modifierService: ModifierService) {}

  @Get()
  async getModifiersByVenueId(@Query('venueId') id: number): Promise<IModifier[] | CMessage> {
    if (!id) {
      return new CMessage('Venue ID is required.', HttpStatus.BAD_REQUEST);
    }

    //TODO insert security check to ensure the user has access to the venue and appropriate roles
    // console.log(`User ${user.id} is requesting modifiers for venue with ID: ${id}`);

    const modifiers = await this.modifierService.findByVenueId(id);
    if (!modifiers) {
      return new CMessage(`Modifiers for venue with ID ${id} not found.`, HttpStatus.NOT_FOUND);
    }

    return modifiers;
  }
}
