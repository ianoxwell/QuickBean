import { CMessage } from '@base/message.class';
import { IProduct, IProductShort } from '@models/products.dto';
import { Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('Product')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Query() productData: IProduct): Promise<IProduct | CMessage> {
    if (!productData.name || !productData.baseCost) {
      return new CMessage('Name and baseCost are required.', HttpStatus.BAD_REQUEST);
    }

    //TODO insert security check to ensure the user has access to create products
    // console.log(`User ${user.id} is creating product: ${productData.name}`);

    const existingProduct = await this.productService.findEntityById(productData.id);
    if (existingProduct) {
      return new CMessage(`Product with ID ${productData.id} already exists.`, HttpStatus.CONFLICT);
    }

    const newProduct = await this.productService.createProduct(productData);
    if (newProduct instanceof CMessage) {
      return newProduct;
    }

    return newProduct;
  }

  // , @CurrentUser() user: IUserJwtPayload
  @Get('active-products')
  async getProductsByVenueId(@Query('venueId') venueId: number): Promise<IProductShort[] | CMessage> {
    if (!venueId) {
      return new CMessage('Id is required.', HttpStatus.BAD_REQUEST);
    }

    //TODO insert security check to ensure the user has access to the venue and appropriate roles
    // console.log(`User ${user.id} is requesting venue with slug: ${slug}`);

    const products = await this.productService.findByVenueIdShort(venueId);
    if (!products) {
      return new CMessage(`Products for venue with ID ${venueId} not found.`, HttpStatus.NOT_FOUND);
    }

    return products;
  }

  @Get()
  async getProductById(@Query('productId') productId: number, @Query('venueId') venueId: number): Promise<IProduct | CMessage> {
    if (!productId) {
      return new CMessage('Id is required.', HttpStatus.BAD_REQUEST);
    }

    // Fetch the product by ID
    const product = await this.productService.findByByIdFullProduct(productId, venueId);
    if (!product) {
      return new CMessage(`Product with ID ${productId} not found.`, HttpStatus.NOT_FOUND);
    }

    return product;
  }
}
