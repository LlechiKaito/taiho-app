export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    address: string;
    telephoneNumber: string;
    gender: string;
    isAdmin: boolean;
  };
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  address: string;
  telephoneNumber: string;
  gender: string;
}

export interface RegisterResponseDto {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    address: string;
    telephoneNumber: string;
    gender: string;
    isAdmin: boolean;
  };
} 