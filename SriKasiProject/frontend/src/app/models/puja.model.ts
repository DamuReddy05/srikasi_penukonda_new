export interface Puja {
  id: number;
  name: string;
  description: string;
  puja_type: 'free' | 'paid';
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  max_participants?: number;
  current_participants: number;
  is_active: boolean;
  created_by: User;
  created_at: string;
  updated_at: string;
  is_full: boolean;
  available_slots?: number;
}

export interface PujaBooking {
  id: number;
  puja: Puja;
  user: User;
  family_members: FamilyMember[];
  number_of_people: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: boolean;
  special_requests?: string;
  booked_at: string;
  updated_at: string;
}

export interface PujaBookingRequest {
  puja: number;
  family_member_ids?: number[];
  number_of_people: number;
  special_requests?: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  puja_type: string;
  price: number;
  is_full: boolean;
  available_slots?: number;
  description: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
}
