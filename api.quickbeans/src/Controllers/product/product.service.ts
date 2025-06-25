import { CMessage } from '@base/message.class';
import { ModifierService } from '@controllers/modifier/modifier.service';
import { IProduct, IProductShort } from '@models/products.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './Product.entity';
import { mapProductToIProduct, mapProductToIProductShort } from './productMaps.util';

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
      relations: ['venue', 'productModifiers', 'productModifiers.modifier', 'productModifiers.modifier.options']
    });

    if (!product) {
      return null;
    }

    return mapProductToIProduct(product);
  }

  async findByVenueId(venueId: number): Promise<IProduct[] | null> {
    const products = await this.productRepository.find({
      where: { venue: { id: venueId }, isActive: true },
      relations: ['venue', 'productModifiers', 'productModifiers.modifier', 'productModifiers.modifier.options']
    });

    if (!products || products.length === 0) {
      return null;
    }
    return products.map((product) => mapProductToIProduct(product));
  }

  async findByVenueIdShort(venueId: number): Promise<IProductShort[] | null> {
    const products = await this.productRepository.find({
      where: { venue: { id: venueId }, isActive: true },
      relations: ['venue']
    });

    if (!products || products.length === 0) {
      return null;
    }
    return products.map((product) => mapProductToIProductShort(product));
  }

  async createProduct(productData: IProduct): Promise<IProduct | CMessage> {
    const existingProduct = await this.productRepository.findOne({ where: { name: productData.name } });
    if (existingProduct) {
      return new CMessage(`Product with name ${productData.name} already exists.`, HttpStatus.CONFLICT);
    }

    const newProduct = this.productRepository.create(productData);
    try {
      const savedProduct = await this.productRepository.save(newProduct);
      return mapProductToIProduct(savedProduct);
    } catch (error: unknown) {
      return new CMessage(
        `Error creating product: ${error instanceof Error && 'message' in error ? error.message : JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
