import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkout } from './Checkout.entity';
import { CheckoutCategory } from './CheckoutCategory.entity';
import { CMessage } from '@base/message.class';
import { ICheckoutCategory, ICheckoutCategoryWithProducts } from '@models/checkout-category.dto';
import { ICheckout, ICheckoutShort } from '@models/checkout.dto';
import { ProductService } from '@controllers/product/product.service';
import { VenueService } from '@controllers/venue/venue.service';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Checkout) private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(CheckoutCategory) private readonly checkoutCategoryRepository: Repository<CheckoutCategory>,
    private productService: ProductService,
    private venueService: VenueService
  ) {}

  async findByVenueId(id: number): Promise<ICheckoutShort[] | null> {
    const checkouts = await this.checkoutRepository.find({
      where: { venue: { id }, isActive: true },
      relations: ['checkoutCategories', 'checkoutCategories.products']
    });

    if (!checkouts || checkouts.length === 0) {
      return null;
    }

    return checkouts.map((checkout) => this.mapCheckoutToICheckoutShort(checkout));
  }

  async findBySlug(slug: string, venueId: number): Promise<ICheckout | null> {
    const checkout = await this.checkoutRepository.findOne({
      where: { slug, isActive: true, venue: { id: venueId } },
      relations: ['venue']
    });
    if (!checkout) {
      return null;
    }
    return this.mapCheckoutToICheckout(checkout);
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
      products: category.products.map((product) => this.productService.mapProductToIProduct(product))
    };
  }

  /** For the venue they have categories as the base definition - relationship might need some tweaking */
  mapCheckoutCategoryToICheckoutCategory(category: CheckoutCategory): ICheckoutCategory {
    return {
      id: category.id,
      name: category.name,
      order: category.order,
      checkoutIds: category.checkouts ? category.checkouts.map((checkout) => checkout.id) : []
    };
  }

  mapCheckoutToICheckoutShort(checkout: Checkout): ICheckoutShort {
    return {
      id: checkout.id,
      name: checkout.name,
      slug: checkout.slug,
      description: checkout.description,
      backgroundImageUrl: checkout.backgroundImageUrl,
      heroImage: checkout.heroImage
    };
  }

  /** Used by the user facing checkout app - so we need details about the opening of the venue */
  mapCheckoutToICheckout(checkout: Checkout, checkoutCategories?: CheckoutCategory[]): ICheckout {
    return {
      ...this.mapCheckoutToICheckoutShort(checkout),
      checkoutCategories: checkoutCategories?.map((category) => this.mapCheckoutCategoryToICheckoutCategoryWithProducts(category)),
      venue: checkout.venue ? this.venueService.mapVenueToIVenue(checkout.venue) : undefined
    };
  }
}
