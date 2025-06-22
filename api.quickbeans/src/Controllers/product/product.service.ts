import { CMessage } from '@base/message.class';
import { ModifierService } from '@controllers/modifier/modifier.service';
import { IProduct, IProductShort } from '@models/products.dto';
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

  async findEntityById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id, isActive: true } });
  }

  async findByByIdFullProduct(id: number, venueId: number): Promise<IProduct | null> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true, venue: { id: venueId } },
      relations: ['venue', 'modifiers', 'modifiers.options']
    });

    if (!product) {
      return null;
    }

    return this.mapProductToIProduct(product);
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

  async findByVenueIdShort(venueId: number): Promise<IProductShort[] | null> {
    const products = await this.productRepository.find({
      where: { venue: { id: venueId }, isActive: true },
      relations: ['venue']
    });

    if (!products || products.length === 0) {
      return null;
    }
    return products.map((product) => this.mapProductToIProductShort(product));
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

  mapProductToIProductShort(product: Product): IProductShort {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      productType: product.productType,
      imageUrl: product.imageUrl
    };
  }

  mapProductToIProduct(product: Product): IProduct {
    return {
      ...this.mapProductToIProductShort(product),
      baseCost: Number(product.baseCost),
      modifiers: product.modifiers.map((modifier) => this.modifierService.mapModifierToIModifier(modifier))
    };
  }
}
