import { Injectable } from '@angular/core';
import { User, Folder, Review } from '../models/user.model';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USERS_KEY = 'movie_users';
  private readonly CURRENT_USER_KEY = 'current_user_id';

  constructor() {
    // Initialize with a default user if no users exist
    if (!this.getUsers().length) {
      this.signup('admin', 'admin123', 'admin@movieapp.com');
    }
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  signup(username: string, password: string, email: string): { success: boolean; message: string } {
    const users = this.getUsers();

    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username already exists' };
    }

    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser: User = {
      id: Date.now(),
      username,
      email,
      profilePicture: undefined,
      favorites: [],
      folders: [],
      reviews: []
    };

    // For demo purposes, store password in a separate private map isn't implemented.
    // If you need full auth, replace with a proper backend.

    users.push(newUser);
    this.saveUsers(users);

    // Auto-login the new user
    localStorage.setItem(this.CURRENT_USER_KEY, newUser.id.toString());

    return { success: true, message: 'Account created successfully' };
  }

  resetPassword(email: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return { success: false, message: 'No account found with this email address' };
    }

    // Demo: just log and return success message
    console.log(`Password reset requested for: ${email}, user: ${user.username}`);

    return { success: true, message: 'Password reset instructions have been sent to your email' };
  }

  login(username: string, password: string): boolean {
    // This demo does not persist passwords, so allow login by username if exists
    const users = this.getUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, user.id.toString());
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const idStr = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!idStr) return null;
    const id = Number(idStr);
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  /* Folder operations */
  getFolders(): Folder[] {
    const user = this.getCurrentUser();
    return user ? user.folders : [];
  }

  createFolder(title: string, description: string): Folder | null {
    const users = this.getUsers();
    const user = this.getCurrentUser();
    if (!user) return null;

    const folder: Folder = { id: Date.now(), title, description, movies: [] };
    user.folders.push(folder);
    // persist
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
      return folder;
    }
    return null;
  }

  addToFolder(folderId: number, movie: Movie): void {
    const users = this.getUsers();
    const user = this.getCurrentUser();
    if (!user) return;
    const folder = user.folders.find(f => f.id === folderId);
    if (!folder) return;
    if (!folder.movies.some(m => m.id === movie.id)) {
      folder.movies.push(movie);
    }
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }
  }

  updateFolder(folderId: number, title: string, description: string): void {
    const users = this.getUsers();
    const user = this.getCurrentUser();
    if (!user) return;
    const folder = user.folders.find(f => f.id === folderId);
    if (!folder) return;
    folder.title = title;
    folder.description = description;
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }
  }

  deleteFolder(folderId: number): void {
    const users = this.getUsers();
    const user = this.getCurrentUser();
    if (!user) return;
    user.folders = user.folders.filter(f => f.id !== folderId);
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }
  }

  /* Favorites operations */
  addToFavorites(movie: Movie): void {
    const users = this.getUsers();
    const user = this.getCurrentUser();
    if (!user) return;
    if (!user.favorites.some(m => m.id === movie.id)) {
      user.favorites.push(movie);
    }
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }
  }

  removeFromFavorites(movieId: number): void {
    const users = this.getUsers();
    const user = this.getCurrentUser();
    if (!user) return;
    user.favorites = user.favorites.filter(m => m.id !== movieId);
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }
  }

  isFavorite(movieId: number): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.favorites.some(m => m.id === movieId);
  }

  /* Reviews and profile */
  addReview(review: Review): void {
    const users = this.getUsers();
    const user = this.getCurrentUser();
    if (!user) return;
    user.reviews.push(review);
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }
  }

  updateProfilePicture(base64Image: string): void {
    const users = this.getUsers();
    const user = this.getCurrentUser();
    if (!user) return;
    user.profilePicture = base64Image;
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }
  }
}