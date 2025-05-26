import { CMessage } from '@base/message.class';
import { ModifierService } from '@controllers/modifier/modifier.service';
import { IProduct } from '@models/products.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './Product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private modifierService: ModifierService
  ) {}

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id, isActive: true } });
  }

  async findByVenueId(venueId: number): Promise<IProduct[] | null> {
    const products = await this.productRepository.find({
      where: { venue: { id: venueId }, isActive: true },
      relations: ['venue', 'modifiers', 'modifiers.options']
    });

    if (!products || products.length === 0) {
      return null;
    }
    return products.map((product) => this.mapProductToIProduct(product));
  }

  async createProduct(productData: IProduct): Promise<IProduct | CMessage> {
    const existingProduct = await this.productRepository.findOne({ where: { name: productData.name } });
    if (existingProduct) {
      return new CMessage(`Product with name ${productData.name} already exists.`, HttpStatus.CONFLICT);
    }

    const newProduct = this.productRepository.create(productData);
    try {
      const savedProduct = await this.productRepository.save(newProduct);
      return savedProduct;
    } catch (error: unknown) {
      return new CMessage(
        `Error creating product: ${error instanceof Error && 'message' in error ? error.message : JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  mapProductToIProduct(product: Product): IProduct {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      baseCost: product.baseCost,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      productType: product.productType,
      modifiers: product.modifiers.map((modifier) => this.modifierService.mapModifierToIModifier(modifier))
    };
  }
}
