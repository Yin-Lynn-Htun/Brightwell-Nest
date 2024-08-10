export class ResponseWrapper<T> {
  status: number;
  message: string;
  data?: T;
  error?: any;
}
