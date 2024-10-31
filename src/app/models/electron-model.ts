export interface ElectronRequest<T> {
  data: T;
  operation: ElectronOperation;
}

export enum ElectronOperation {
  Get = 'get',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export type GetRequestData = GetAllRequestData | GetByIdRequestData;

export interface GetRequestBaseData {
  get: string;
}

export interface GetAllRequestData extends GetRequestBaseData {
  get: 'all';
}

export interface GetByIdRequestData extends GetRequestBaseData {
  get: 'byId';
  id: number;
}
