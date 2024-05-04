export interface IUser {
  id: string;
  name: string;
  color: string;
}

export type IUserPublic = Omit<IUser, 'id'> & { isOwner: boolean };

export type CreateUserRequest = { name: string; color: string };

export interface CreateUserResponse {
  id: string;
}

export interface DeleteUserRequest {
  id: string;
}
