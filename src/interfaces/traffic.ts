import { IUserPublic } from './user';

export interface ITraffic {
  id: string;
  serverId: string;
  note: string;
  ownerId: string;
  startTime: string;
  beginServiceTime: string;
}

export type ITrafficPublic = Omit<
  Omit<ITraffic, 'ownerId'>,
  'beginServiceTime'
> & {
  owner: IUserPublic;
  isWaiting: boolean;
};

export interface CreateTrafficRequest {
  serverId: string;
}

export type CreateTrafficBroadcastResponse = ITrafficPublic;

export interface UpdateTrafficRequest {
  id: string;
  serverId: string;
}

export interface UpdateTrafficBroadcastResponse {
  change: ITrafficPublic;
}

export interface DeleteTrafficRequest {
  id: string;
  serverId: string;
}

export type DeleteTrafficBroadcastResponse = DeleteTrafficRequest;

export interface SaveTrafficRequest {
  id: string;
  serverId: string;
}

export type SaveTrafficBroadcastResponse = SaveTrafficRequest;

export type SaveAndDeleteTrafficRequest = DeleteTrafficRequest &
  SaveTrafficRequest;

export type SaveAndDeleteTrafficBroadcastResponse = { id: string };
