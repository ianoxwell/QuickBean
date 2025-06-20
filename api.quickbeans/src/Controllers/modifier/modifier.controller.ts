import { CMessage } from '@base/message.class';
import { IModifier } from '@models/modifier.dto';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModifierService } from './modifier.service';

@ApiTags('Modifier')
@Controller('modifier')
export class ModifierController {
  constructor(private readonly modifierService: ModifierService) {}

  @Get('active-modifiers')
  async getModifiersByVenueId(@Query('venueId') venueId: number): Promise<IModifier[] | CMessage> {
    if (!venueId) {
      return new CMessage('Venue ID is required.', HttpStatus.BAD_REQUEST);
    }

    //TODO insert security check to ensure the user has access to the venue and appropriate roles
    // console.log(`User ${user.id} is requesting modifiers for venue with ID: ${id}`);

    const modifiers = await this.modifierService.findByVenueId(venueId);
    if (!modifiers) {
      return new CMessage(`Modifiers for venue with ID ${venueId} not found.`, HttpStatus.NOT_FOUND);
    }

    return modifiers;
  }

  @Get()
  async getModifierById(@Query('modifierId') modifierId: number): Promise<IModifier | CMessage> {
    if (!modifierId) {
      return new CMessage('Modifier ID is required.', HttpStatus.BAD_REQUEST);
    }

    // Fetch the modifier by ID
    const modifier = await this.modifierService.findById(modifierId);
    if (!modifier) {
      return new CMessage(`Modifier with ID ${modifierId} not found.`, HttpStatus.NOT_FOUND);
    }

    return modifier;
  }
}
