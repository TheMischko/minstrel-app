export interface ElectronRequest<T> {
  data: T;
  operation: ElectronOperation;
  responseChannel?: string;
}

export enum ElectronOperation {
  Get = 'get',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}
