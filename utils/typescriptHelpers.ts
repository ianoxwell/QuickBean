import { IMessage } from '@models/message.dto';

export function isMessage<T>(payload: IMessage | T | undefined): payload is IMessage {
  if (payload === null || payload === undefined) {
    return false;
  }

  //magic happens here
  return (payload as IMessage).message !== undefined;
}
