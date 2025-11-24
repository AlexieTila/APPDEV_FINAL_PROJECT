import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USERS_KEY = 'movie_users';
  private readonly CURRENT_USER_KEY = 'current_user';

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
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username already exists' };
    }

    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Add new user
    users.push({ username, password, email });
    this.saveUsers(users);
    
    return { success: true, message: 'Account created successfully' };
  }

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, username);
      return true;
    }
    
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem(this.CURRENT_USER_KEY);
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  resetPassword(email: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { 
        success: false, 
        message: 'No account found with this email address' 
      };
    }
    
    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it with an expiration time
    // 3. Send an email with a reset link containing the token
    // 4. Verify the token when the user clicks the link
    // 5. Allow them to set a new password
    
    // For this demo, we'll just simulate the process
    console.log(`Password reset email would be sent to: ${email}`);
    console.log(`User: ${user.username}`);
    
    return { 
      success: true, 
      message: 'Password reset instructions have been sent to your email' 
    };
  }

  // Method to actually change password (for future implementation)
  changePassword(email: string, newPassword: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return { 
        success: false, 
        message: 'User not found' 
      };
    }
    
    users[userIndex].password = newPassword;
    this.saveUsers(users);
    
    return { 
      success: true, 
      message: 'Password updated successfully' 
    };
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }

  getUserByUsername(username: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.username === username);
  }
}