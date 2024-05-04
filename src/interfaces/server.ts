export interface IServer {
  id: string;
  name: string;
  startTime: string;
}

export interface CreateServerRequest {
  name: string;
}

export type CreateServerBroadcastResponse = IServer;

export interface SaveServerRequest {
  id: string;
}

export interface DeleteServerRequest {
  id: string;
}

export interface DeleteServerBroadcaseResponse {
  id: string;
}

export type SaveAndDeleteServerRequest = SaveServerRequest &
  DeleteServerRequest;

export type SaveAndDeleteServerBroadcastResponse =
  DeleteServerBroadcaseResponse;
