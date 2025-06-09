import { IMessage } from '@models/message.dto';

export function isMessage<T>(payload: IMessage | T): payload is IMessage {
  //magic happens here
  return (payload as IMessage).message !== undefined;
}
