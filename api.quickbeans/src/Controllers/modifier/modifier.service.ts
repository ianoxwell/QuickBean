import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modifier, ModifierOption } from './Modifier.entity';
import { IModifier, IModifierOption } from '@models/modifier.dto';

@Injectable()
export class ModifierService {
  constructor(@InjectRepository(Modifier) private readonly modifierRepository: Repository<Modifier>) {}

  async findByVenueId(venueId: number): Promise<IModifier[] | null> {
    const modifiers = await this.modifierRepository.find({
      where: { venue: { id: venueId }, isActive: true },
      relations: ['venue', 'options']
    });

    if (!modifiers || modifiers.length === 0) {
      return null;
    }

    return modifiers.map((modifier) => this.mapModifierToIModifier(modifier));
  }

  mapModifierToIModifier(modifier: Modifier): IModifier {
    return {
      id: modifier.id,
      name: modifier.name,
      options: modifier.options.map((option) => this.mapModifierOptionsToIProduct(option))
    };
  }

  mapModifierOptionsToIProduct(modifierOption: ModifierOption): IModifierOption {
    return {
      id: modifierOption.id,
      label: modifierOption.label,
      description: modifierOption.description,
      priceAdjustment: modifierOption.priceAdjustment,
      percentAdjustment: modifierOption.percentAdjustment
    };
  }
}
