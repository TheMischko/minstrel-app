export enum RequestOperation {
  Get = 'get',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export interface ElectronRequest<T> {
  data: T;
  operation: RequestOperation;
}
