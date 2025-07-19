// src/types/club.ts

export interface Club {
  id: string;
  name: string;
  shortName: string;
  image?: string | null; // Base64 encoded image
  foregroundColor: string;
  backgroundColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Season {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date | null;
  active: boolean;
  clubId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClubUser {
  id: string;
  userId: string;
  clubId: string;
  role: ClubRole;
  joinedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: UserRole;
    active: boolean;
  };
}

export interface ClubWithUser {
  club: Club;
  role: ClubRole;
  joinedAt: Date;
}

export interface ClubWithDetails extends Club {
  seasons: Season[];
  clubUsers: ClubUser[];
  _count: {
    clubUsers: number;
  };
}

export type ClubRole = 'OWNER' | 'MANAGER' | 'COACH' | 'MEMBER';
export type UserRole = 'ADMIN' | 'COACH' | 'CLIENT';

// Props interfaces
export interface ClubSelectionFormProps {
  clubs: ClubWithUser[];
  currentClubId?: string;
}

export interface ClubSelectorProps {
  currentClub: Club;
  userClubs: ClubWithUser[];
}

export interface CreateClubFormProps {
  onSuccess?: (club: Club) => void;
  onCancel?: () => void;
}

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export interface ImageUploadProps {
  value?: string | null;
  onChange: (base64Image: string | null) => void;
  disabled?: boolean;
}

export interface ClubsTableProps {
  clubs: ClubWithDetails[];
}

export interface ClubDetailsProps {
  club: ClubWithDetails;
}

export interface ClubUsersManagerProps {
  club: ClubWithDetails;
}

export interface AddUserToClubModalProps {
  club: ClubWithDetails;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface UserClubRoleBadgeProps {
  role: ClubRole;
}

export interface ClubThemeProviderProps {
  club: Club | null;
  children: React.ReactNode;
}

export interface ClubThemeContextType {
  club: Club | null;
}

// Page Props
export interface ClubDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

// Form schemas
export interface CreateClubFormData {
  name: string;
  shortName: string;
  foregroundColor: string;
  backgroundColor: string;
}

export interface UpdateClubFormData {
  name?: string;
  shortName?: string;
  image?: string | null; // Base64 encoded image
  foregroundColor?: string;
  backgroundColor?: string;
}

export interface AddUserToClubData {
  userId: string;
  role: ClubRole;
}

export interface SetDefaultClubData {
  clubId: string | null;
}

// API Response types
export interface ClubApiResponse {
  club?: Club;
  clubs?: Club[];
  error?: string;
  details?: any;
}

export interface ClubUserApiResponse {
  clubUser?: ClubUser;
  clubUsers?: ClubUser[];
  error?: string;
  details?: any;
}