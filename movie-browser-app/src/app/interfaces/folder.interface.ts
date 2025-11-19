export interface Folder {
  id: string;
  userId: string;
  name: string;
  description: string;
  movieIds: string[];
  createdAt: Date;
  updatedAt?: Date;
  color?: string;
  isPublic?: boolean;
}

export interface CreateFolderRequest {
  name: string;
  description: string;
  color?: string;
  isPublic?: boolean;
}

export interface UpdateFolderRequest {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  isPublic?: boolean;
}
