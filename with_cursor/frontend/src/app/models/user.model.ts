export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
  user_type: 'admin' | 'devotee';
  profile_picture?: string;
  date_of_birth?: string;
  date_joined: string;
  last_login?: string;
  family_members?: FamilyMember[];
}

export interface FamilyMember {
  id: number;
  name: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  date_of_birth?: string;
  phone_number?: string;
  email?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}
