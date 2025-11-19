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
      this.currentUser.favorites.push(movie);
      this.saveUser();
    }
  }

  removeFromFavorites(movieId: number) {
    if (this.currentUser) {
      this.currentUser.favorites = this.currentUser.favorites.filter(m => m.id !== movieId);
      this.saveUser();
    }
  }

  createFolder(title: string, description: string) {
    if (this.currentUser) {
      const folder: Folder = { id: Date.now(), title, description, movies: [] };
      this.currentUser.folders.push(folder);
      this.saveUser();
    }
  }

  addToFolder(folderId: number, movie: Movie) {
    if (this.currentUser) {
      const folder = this.currentUser.folders.find(f => f.id === folderId);
      if (folder && !folder.movies.some(m => m.id === movie.id)) {
        folder.movies.push(movie);
        this.saveUser();
      }
    }
  }

  addReview(review: Review) {
    if (this.currentUser) {
      this.currentUser.reviews.push(review);
      this.saveUser();
    }
  }

  private saveUser() {
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }
}