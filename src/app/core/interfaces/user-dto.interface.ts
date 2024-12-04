export interface RegisterDTO {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}
export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserInfoDTO {
  token: string;
}

export interface UserDTO {
  id: string;
  name: string;
  lastname: string;
  username?: string;
  email: string;
  amount?: number;
  created: string;
  updated: string;
}

export interface UpdateDTO {
  name: string;
  lastname: string;
  username?: string;
  email: string;
}
