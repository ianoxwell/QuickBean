import { CMessage } from '@base/message.class';
import { mapProductToIProduct } from '@controllers/product/productMaps.util';
import { UserService } from '@controllers/user/user.service';
import { VenueService } from '@controllers/venue/venue.service';
import { ERole } from '@models/base.dto';
import { ICheckoutCategory, ICheckoutCategoryWithProducts } from '@models/checkout-category.dto';
import { ICheckout, ICheckoutShort } from '@models/checkout.dto';
import { IUserSummary } from '@models/user.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkout } from './Checkout.entity';
import { CheckoutCategory } from './CheckoutCategory.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Checkout) private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(CheckoutCategory) private readonly checkoutCategoryRepository: Repository<CheckoutCategory>,
    private venueService: VenueService,
    private userService: UserService
  ) {}

  async findByVenueId(id: number): Promise<ICheckoutShort[] | null> {
    const checkouts = await this.checkoutRepository.find({
      where: { venue: { id }, isActive: true },
      relations: ['categories', 'categories.products', 'categories.products.modifiers', 'venue']
    });

    if (!checkouts || checkouts.length === 0) {
      return null;
    }

    return checkouts.map((checkout) => this.mapCheckoutToICheckoutShort(checkout));
  }

  async findActiveByVenueId(venueId: number, userId: number): Promise<ICheckoutShort[] | CMessage> {
    console.time('findActiveByVenueId');
    const user: IUserSummary = await this.userService.findById(userId);
    if (!user) {
      console.timeEnd('findActiveByVenueId');
      return new CMessage(`User with ID ${userId} not found.`, HttpStatus.NOT_FOUND);
    }

    //if user does not have access to the venue, return an error
    const venue = await this.venueService.findById(venueId);
    if (!venue) {
      console.timeEnd('findActiveByVenueId');

      return new CMessage(`Venue with ID ${venueId} not found.`, HttpStatus.NOT_FOUND);
    }

    if (!this.venueService.userHasAccessToVenue(user, venue, [ERole.ADMIN])) {
      console.log(`User with ID ${userId} does not have access to venue with ID ${venueId}.`, user.roles, user.venues);
      console.timeEnd('findActiveByVenueId');

      return new CMessage(`User with ID ${userId} does not have access to venue with ID ${venueId}.`, HttpStatus.FORBIDDEN);
    }

    const checkouts = await this.checkoutRepository.find({
      where: { venue: { id: venueId }, isActive: true },
      relations: ['categories', 'categories.products', 'categories.products.modifiers', 'venue']
    });

    if (!checkouts || checkouts.length === 0) {
      return new CMessage(`No active checkouts found for venue with ID ${venueId}.`, HttpStatus.NOT_FOUND);
    }

    const mappedCheckouts = checkouts.map((checkout) => this.mapCheckoutToICheckoutShort(checkout));
    console.timeEnd('findActiveByVenueId');
    return mappedCheckouts;
  }

  async findBySlug(slug: string, venueSlug: string): Promise<ICheckout | null> {
    console.time('findBySlug');
    const checkout = await this.checkoutRepository
      .createQueryBuilder('checkout')
      .leftJoinAndSelect('checkout.venue', 'venue')
      .leftJoinAndSelect('checkout.categories', 'categories')
      .leftJoinAndSelect('categories.products', 'products')
      .leftJoinAndSelect('products.modifiers', 'modifiers')
      .leftJoinAndSelect('modifiers.options', 'options')
      .where('checkout.slug = :slug', { slug })
      .andWhere('checkout.isActive = true')
      .andWhere('venue.slug = :venueSlug', { venueSlug })
      .getOne();

    if (!checkout) {
      return null;
    }

    const mappedCheckout = this.mapCheckoutToICheckout(checkout, checkout.categories);
    console.timeEnd('findBySlug');

    return mappedCheckout;
  }

  async updateCheckout(id: number, checkoutData: ICheckout): Promise<ICheckout | CMessage> {
    const existingCheckout = await this.checkoutRepository.findOne({ where: { id } });
    if (!existingCheckout) {
      return new CMessage(`Checkout with ID ${id} does not exist.`, HttpStatus.NOT_FOUND);
    }

    const updatedCheckout = this.checkoutRepository.merge(existingCheckout, checkoutData);
    try {
      const savedCheckout = await this.checkoutRepository.save(updatedCheckout);
      return this.mapCheckoutToICheckout(savedCheckout);
    } catch (error: unknown) {
      return new CMessage(
        `Error updating checkout: ${error instanceof Error && 'message' in error ? error.message : JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getCheckoutCategoriesByVenueAndCheckout(venueId: number, checkoutId: number): Promise<ICheckoutCategory[] | CMessage> {
    const categories = await this.checkoutCategoryRepository.find({
      where: { checkouts: { id: checkoutId }, isActive: true },
      relations: ['checkouts']
    });
    if (!categories || categories.length === 0) {
      return new CMessage(`No checkout categories found for venue ID ${venueId}.`, HttpStatus.NOT_FOUND);
    }

    return categories.map((category) => this.mapCheckoutCategoryToICheckoutCategory(category));
  }

  async getCheckoutCategoryByVenue(venueId: number): Promise<ICheckoutCategory[] | CMessage> {
    const rawCategories = await this.checkoutCategoryRepository
      .createQueryBuilder('category')
      .innerJoin('category.checkouts', 'checkout')
      .where('checkout.venueId = :venueId', { venueId })
      .andWhere('category.isActive = true')
      .select(['DISTINCT category.id', 'category.name', 'category.order'])
      .getMany();
    if (!rawCategories || rawCategories.length === 0) {
      return new CMessage(`No checkout categories found for venue ID ${venueId}.`, HttpStatus.NOT_FOUND);
    }

    return rawCategories.map((category) => this.mapCheckoutCategoryToICheckoutCategory(category));
  }

  /** For the checkout definition, includes categories and products */
  mapCheckoutCategoryToICheckoutCategoryWithProducts(category: CheckoutCategory): ICheckoutCategoryWithProducts {
    return {
      id: category.id,
      name: category.name,
      order: category.order,
      productType: category.productType,
      products: category.products.map((product) => mapProductToIProduct(product))
    };
  }

  /** For the venue they have categories as the base definition - relationship might need some tweaking */
  mapCheckoutCategoryToICheckoutCategory(category: CheckoutCategory): ICheckoutCategory {
    return {
      id: category.id,
      name: category.name,
      productType: category.productType,
      order: category.order,
      checkoutIds: category.checkouts ? category.checkouts.map((checkout) => checkout.id) : []
    };
  }

  mapCheckoutToICheckoutShort(checkout: Checkout): ICheckoutShort {
    return {
      id: checkout.id,
      name: checkout.name,
      slug: checkout.slug,
      checkoutUrl: `${checkout.venue.slug}/${checkout.slug}`
    };
  }

  /** Used by the user facing checkout app - so we need details about the opening of the venue */
  mapCheckoutToICheckout(checkout: Checkout, checkoutCategories?: CheckoutCategory[]): ICheckout {
    return {
      ...this.mapCheckoutToICheckoutShort(checkout),
      heroImage: checkout.heroImage,
      heroImageTextColor: checkout.heroImageTextColor,
      description: checkout.description,
      categories: checkoutCategories?.map((category) => this.mapCheckoutCategoryToICheckoutCategoryWithProducts(category)),
      venue: checkout.venue ? this.venueService.mapVenueToIVenue(checkout.venue) : undefined
    };
  }
}
