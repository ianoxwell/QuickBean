import { CMessage } from '@base/message.class';
import { EventsGateway } from '@controllers/events/events.gateway';
import { UserService } from '@controllers/user/user.service';
import { VenueService } from '@controllers/venue/venue.service';
import { EOrderStatus } from '@models/base.dto';
import { IOrder } from '@models/order.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './Order.entity';
import { mapOrderToIOrder } from './order.util';
import { OrderItem } from './OrderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    private venueService: VenueService,
    private userService: UserService,
    private eventsGateway: EventsGateway
  ) {}

  async findOrderById(id: number): Promise<IOrder | null> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['venue', 'patron', 'items', 'items.product']
    });
    if (!order) {
      return null;
    }

    return mapOrderToIOrder(order);
  }

  async findOrdersByVenueId(venueId: number, take = 200): Promise<Order[] | null> {
    return this.orderRepository.find({
      where: { venue: { id: venueId } },
      relations: ['venue', 'items', 'items.product'],
      take
    });
  }

  async findOrdersByPatronId(patronId: number, take = 200): Promise<IOrder[] | null> {
    console.time('findOrdersByPatronId');
    const orders: Order[] = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.venue', 'venue')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('order.patron', 'patron')
      .leftJoinAndSelect('order.checkout', 'checkout')
      .where('patron.id = :patronId', { patronId })
      .orderBy('order.orderDate', 'DESC')
      .take(take)
      .getMany();
    if (!orders || orders.length === 0) {
      return null;
    }

    console.timeEnd('findOrdersByPatronId');
    return orders.map((order) => mapOrderToIOrder(order));
  }

  async createOrder(orderData: IOrder): Promise<IOrder | CMessage> {
    const order: Order = this.orderRepository.create(orderData);
    order.amountPaid = order.grandTotal || 0; // Ensure amountPaid is set to grandTotal if not provided
    order.items = orderData.items.map((item) => {
      const orderItem = this.orderItemRepository.create(item);
      orderItem.order = order; // Set the order reference
      return orderItem;
    });
    // Set order date to now if not provided or invalid
    order.orderDate = orderData.orderDate ? new Date(orderData.orderDate) : new Date();
    order.orderStatus = EOrderStatus.PENDING; // Default booking status

    // check if the venue, checkout and patron exist
    const venue = await this.venueService.findByIdEntity(orderData.venueId);
    if (!venue) {
      return new CMessage(`Venue with ID ${orderData.venueId} does not exist.`, HttpStatus.BAD_REQUEST);
    }
    let patron = await this.userService.findByIdEntity(orderData.patronId);
    if (!patron) {
      patron = await this.userService.findByEmailEntity(orderData.patron?.email);
      if (!patron) {
        patron = await this.userService.createUserEntity(orderData.patron, venue);
        if (patron instanceof CMessage) {
          return patron; // Return the error message if user creation failed
        }
      }
    }

    order.venue = venue;
    order.patron = patron;

    try {
      const savedOrder = await this.orderRepository.save(order);
      this.eventsGateway.notifyKitchenOrderUpdate(savedOrder, true);
      return mapOrderToIOrder(savedOrder);
    } catch (error: unknown) {
      return new CMessage(
        `Error creating order: ${error instanceof Error && 'message' in error ? error.message : JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateOrderStatus(
    receiptNumber: string,
    status: EOrderStatus
  ): Promise<{ receiptNumber: string; status: EOrderStatus } | CMessage> {
    const order = await this.orderRepository.findOne({ where: { receiptNumber }, loadRelationIds: false });
    if (!order) {
      return new CMessage(`Order with receipt number ${receiptNumber} not found.`, HttpStatus.NOT_FOUND);
    }

    if (order.orderStatus !== status) {
      order.orderStatus = status;
      try {
        // Note if I get the relations to start with I usually get an error on saving
        const updatedOrder = await this.orderRepository.save(order);
        this.eventsGateway.notifyOrderStatusUpdate({ receiptNumber, status });
        const newOrderFull = await this.orderRepository.findOne({
          where: { id: updatedOrder.id },
          relations: ['items', 'items.product', 'venue']
        });
        if (!newOrderFull) {
          return new CMessage(`Order with ID ${updatedOrder.id} not found after update.`, HttpStatus.NOT_FOUND);
        }

        this.eventsGateway.notifyKitchenOrderUpdate(newOrderFull);
        return { receiptNumber: updatedOrder.receiptNumber, status: updatedOrder.orderStatus };
      } catch (error: unknown) {
        return new CMessage(
          `Error updating order status: ${error instanceof Error && 'message' in error ? error.message : JSON.stringify(error)}`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
