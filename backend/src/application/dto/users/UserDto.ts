export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  address: string;
  telephoneNumber: string;
  gender: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponseDto {
  users: UserResponseDto[];
  total: number;
} 