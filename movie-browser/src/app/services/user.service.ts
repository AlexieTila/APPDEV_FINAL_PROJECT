import { Injectable } from '@angular/core';
import { User, Folder, Review, Movie } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: User | null = null;
  private users: { [key: string]: { password: string; user: User } } = {};

  constructor() {
    // Load users from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  signup(username: string, password: string, email: string): { success: boolean; message: string } {
    // Validate inputs
    if (!username || !password || !email) {
      return { success: false, message: 'All fields are required' };
    }

    if (username.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    if (this.users[username]) {
      return { success: false, message: 'Username already exists' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now(),
      username,
      favorites: [],
      folders: [],
      reviews: []
    };

    this.users[username] = { password, user: newUser };
    localStorage.setItem('users', JSON.stringify(this.users));

    return { success: true, message: 'Account created successfully' };
  }

  login(username: string, password: string): boolean {
    // Check stored users first
    if (this.users[username] && this.users[username].password === password) {
      this.currentUser = this.users[username].user;
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return true;
    }

    // Mock login for default user
    if (username === 'user' && password === 'pass') {
      this.currentUser = { id: 1, username, favorites: [], folders: [], reviews: [] };
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return true;
    }

    return false;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const user = localStorage.getItem('user');
      this.currentUser = user ? JSON.parse(user) : null;
    }
    return this.currentUser;
  }

  addToFavorites(movie: Movie) {
    if (this.currentUser) {
      // Check if movie is already in favorites
      const exists = this.currentUser.favorites.some(m => m.id === movie.id);
      if (!exists) {
        this.currentUser.favorites.push(movie);
        this.saveUser();
        this.updateStoredUser();
      }
    }
  }

  removeFromFavorites(movieId: number) {
    if (this.currentUser) {
      this.currentUser.favorites = this.currentUser.favorites.filter(m => m.id !== movieId);
      this.saveUser();
      this.updateStoredUser();
    }
  }

  isFavorite(movieId: number): boolean {
    if (this.currentUser) {
      return this.currentUser.favorites.some(m => m.id === movieId);
    }
    return false;
  }

  createFolder(title: string, description: string): Folder | null {
    if (this.currentUser) {
      const folder: Folder = { id: Date.now(), title, description, movies: [] };
      this.currentUser.folders.push(folder);
      this.saveUser();
      this.updateStoredUser();
      return folder;
    }
    return null;
  }

  updateFolder(folderId: number, title: string, description: string) {
    if (this.currentUser) {
      const folder = this.currentUser.folders.find(f => f.id === folderId);
      if (folder) {
        folder.title = title;
        folder.description = description;
        this.saveUser();
        this.updateStoredUser();
      }
    }
  }

  deleteFolder(folderId: number) {
    if (this.currentUser) {
      this.currentUser.folders = this.currentUser.folders.filter(f => f.id !== folderId);
      this.saveUser();
      this.updateStoredUser();
    }
  }

  addToFolder(folderId: number, movie: Movie) {
    if (this.currentUser) {
      const folder = this.currentUser.folders.find(f => f.id === folderId);
      if (folder && !folder.movies.some(m => m.id === movie.id)) {
        folder.movies.push(movie);
        this.saveUser();
        this.updateStoredUser();
      }
    }
  }

  removeFromFolder(folderId: number, movieId: number) {
    if (this.currentUser) {
      const folder = this.currentUser.folders.find(f => f.id === folderId);
      if (folder) {
        folder.movies = folder.movies.filter(m => m.id !== movieId);
        this.saveUser();
        this.updateStoredUser();
      }
    }
  }

  getFolders(): Folder[] {
    return this.currentUser?.folders || [];
  }

  addReview(review: Review) {
    if (this.currentUser) {
      this.currentUser.reviews.push(review);
      this.saveUser();
      this.updateStoredUser();
    }
  }

  updateProfilePicture(profilePicture: string) {
    if (this.currentUser) {
      this.currentUser.profilePicture = profilePicture;
      this.saveUser();
      this.updateStoredUser();
    }
  }

  private saveUser() {
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }

  private updateStoredUser() {
    // Update the user in the users object as well
    if (this.currentUser) {
      const username = this.currentUser.username;
      if (this.users[username]) {
        this.users[username].user = this.currentUser;
        localStorage.setItem('users', JSON.stringify(this.users));
      }
    }
  }
}
