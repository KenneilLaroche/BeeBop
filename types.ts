export enum CollegeYear {
  FRESHMAN = 'Freshman',
  SOPHOMORE = 'Sophomore',
  JUNIOR = 'Junior',
  SENIOR = 'Senior',
  GRAD = 'Grad Student',
  ALUMNI = 'Alumni'
}

export interface User {
  username: string;
  email: string;
  school: string;
  password?: string;
  profilePicUrl?: string;
  isAuthenticated: boolean;
}

export interface BopProfile {
  id: string;
  name: string;
  school: string;
  year: CollegeYear;
  imageUrl: string;
  rating: number; // Current average rating (1-10 scale)
  voteCount: number; // Number of votes cast
  totalScore: number; // Sum of all rating values
  description: string;
  createdAt: number;
  authorEmail?: string;
}

export interface CreateBopFormData {
  name: string;
  school: string;
  year: CollegeYear;
  rating: number;
  description: string;
}