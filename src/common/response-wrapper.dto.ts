export class ResponseWrapper<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: any;
}
