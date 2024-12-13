export type AnnouncementPriority = "normal" | "high";

export interface Author {
  id: number;
  name: string;
  position: string;
  avatar?: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  author: Author;
  created_at: string;
  updated_at?: string;
  is_read: boolean;
}

export interface CreateAnnouncement {
  title: string;
  content: string;
  priority: AnnouncementPriority;
}

export interface AnnouncementListProps {
  announcements: Announcement[];
  onAnnouncementClick: (announcement: Announcement) => void;
}

export interface AnnouncementDetailProps {
  announcement: Announcement;
  isOpen: boolean;
  onClose: () => void;
  canEdit?: boolean;
  onEdit?: () => void;
}

export interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAnnouncement) => Promise<void>;
  initialData?: Announcement | null;
}

export interface AnnouncementState {
  announcements: AnnouncementResponse;
  selectedAnnouncement: Announcement | null;
  isLoading: boolean;
  error: string | null;
}

export interface AnnouncementResponse {
  items: Announcement[];
  total: number;
  unread: number;
}

export interface AnnouncementFilters {
  search?: string;
  priority?: AnnouncementPriority | "all";
  startDate?: string;
  endDate?: string;
}

export type AnnouncementSortField = "created_at" | "priority" | "title";
export type SortDirection = "asc" | "desc";

export interface AnnouncementSort {
  field: AnnouncementSortField;
  direction: SortDirection;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface GetAnnouncementsParams extends PaginationParams {
  filters?: AnnouncementFilters;
  sort?: AnnouncementSort;
}
