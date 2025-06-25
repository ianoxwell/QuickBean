import { IModifier } from '@models/modifier.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modifier } from './Modifier.entity';
import { mapModifierToIModifier, mapModifierToIProductModifier } from './modifierMaps.util';

@Injectable()
export class ModifierService {
  constructor(@InjectRepository(Modifier) private readonly modifierRepository: Repository<Modifier>) {}

  async findByVenueId(venueId: number): Promise<IModifier[] | null> {
    const modifiers = await this.modifierRepository.find({
      where: { venue: { id: venueId }, isActive: true },
      relations: ['venue', 'options', 'productModifiers', 'productModifiers.product']
    });

    if (!modifiers || modifiers.length === 0) {
      return null;
    }

    return modifiers.map((modifier) => mapModifierToIModifier(modifier));
  }

  /** Find an individual modifier along with associated products */
  async findById(modifierId: number): Promise<IModifier | null> {
    const modifier = await this.modifierRepository.findOne({
      where: { id: modifierId, isActive: true },
      relations: ['venue', 'options', 'productModifiers', 'productModifiers.product']
    });

    if (!modifier) {
      return null;
    }
    return mapModifierToIProductModifier(modifier);
  }
}
