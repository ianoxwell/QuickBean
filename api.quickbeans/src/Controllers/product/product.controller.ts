import { CMessage } from '@base/message.class';
import { IProduct } from '@models/products.dto';
import { Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('Product')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth('JWT-auth')
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

    const existingProduct = await this.productService.findById(productData.id);
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
  @Get()
  async getProductsByVenueId(@Query('venueId') id: number): Promise<IProduct[] | CMessage> {
    if (!id) {
      return new CMessage('Id is required.', HttpStatus.BAD_REQUEST);
    }

    //TODO insert security check to ensure the user has access to the venue and appropriate roles
    // console.log(`User ${user.id} is requesting venue with slug: ${slug}`);

    const products = await this.productService.findByVenueId(id);
    if (!products) {
      return new CMessage(`Products for venue with ID ${id} not found.`, HttpStatus.NOT_FOUND);
    }

    return products;
  }
}
