import { CMessage } from '@base/message.class';
import { UserService } from '@controllers/user/user.service';
import { VenueService } from '@controllers/venue/venue.service';
import { IOrder, IOrderItem } from '@models/order.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './Order.entity';
import { OrderItem } from './OrderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    private venueService: VenueService,
    private userService: UserService
  ) {}

  async findOrderById(id: number): Promise<IOrder | null> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['venue', 'patron', 'items', 'items.product']
    });
    if (!order) {
      return null;
    }

    return this.mapOrderToIOrder(order);
  }

  async findOrdersByVenueId(venueId: number, take = 200): Promise<Order[] | null> {
    return this.orderRepository.find({
      where: { venue: { id: venueId } },
      relations: ['venue', 'items', 'items.product'],
      take
    });
  }

  async findOrdersByPatronId(patronId: number, take = 200): Promise<IOrder[] | null> {
    const orders = await this.orderRepository.find({
      where: { patron: { id: patronId } },
      relations: ['venue', 'items', 'items.product'],
      take
    });
    if (!orders || orders.length === 0) {
      return null;
    }

    return orders.map((order) => this.mapOrderToIOrder(order));
  }

  async createOrder(orderData: IOrder): Promise<IOrder | CMessage> {
    const order = this.orderRepository.create(orderData);
    order.items = orderData.items.map((item) => {
      const orderItem = this.orderItemRepository.create(item);
      orderItem.order = order; // Set the order reference
      return orderItem;
    });

    // check if the venue, checkout and patron exist
    const venue = await this.venueService.findByIdEntity(orderData.venueId);
    if (!venue) {
      return new CMessage(`Venue with ID ${orderData.venueId} does not exist.`, HttpStatus.BAD_REQUEST);
    }
    let patron = await this.userService.findByIdEntity(orderData.patronId);
    if (!patron) {
      // create a new patron if it does not exist
      if (!orderData.patron) {
        return new CMessage(`Patron with ID ${orderData.patronId} does not exist.`, HttpStatus.BAD_REQUEST);
      }

      patron = await this.userService.createUserEntity(orderData.patron, venue);
      if (patron instanceof CMessage) {
        return patron; // Return the error message if user creation failed
      }
    }

    order.venue = venue;
    order.patron = patron;

    try {
      const savedOrder = await this.orderRepository.save(order);
      return this.mapOrderToIOrder(savedOrder);
    } catch (error: unknown) {
      return new CMessage(
        `Error creating order: ${error instanceof Error && 'message' in error ? error.message : JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  mapOrderToIOrder(order: Order): IOrder {
    return {
      id: order.id,
      orderDate: order.orderDate,
      receiptNumber: order.receiptNumber,
      amountPaid: order.amountPaid,
      grandTotal: order.grandTotal,
      discount: order.discount,
      comments: order.comments,
      bookingStatus: order.bookingStatus,
      items: order.items.map((item) => this.mapOrderItemToIOrderItem(item)),
      venueId: order.venue?.id,
      venue: order.venue ? { id: order.venue.id, name: order.venue.name, slug: order.venue.slug } : undefined,
      patronId: order.patron?.id,
      patron: order.patron ? { id: order.patron.id, name: order.patron.name, email: order.patron.email } : undefined
    };
  }

  mapOrderItemToIOrderItem(item: OrderItem): IOrderItem {
    return {
      id: item.id,
      productId: item.product.id,
      quantity: item.quantity,
      price: item.price,
      selectedModifiers: item.selectedModifiers // Assuming this is already in the correct format
    };
  }
}
