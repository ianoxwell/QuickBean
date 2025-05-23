import { IMessage } from '@models/message.dto';
import { HttpStatus } from '@nestjs/common';

export class CMessage implements IMessage {
  message: string;
  status?: HttpStatus;

  constructor(message: string, status: HttpStatus = HttpStatus.OK) {
    this.message = message;
    this.status = status;
  }
}
