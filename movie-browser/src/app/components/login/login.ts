import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  isSignupMode = false;
  isForgotPasswordMode = false;
  username = '';
  password = '';
  email = '';
  confirmPassword = '';
  successMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  onLogin() {
    if (this.userService.login(this.username, this.password)) {
      this.router.navigate(['/movies']);
    } else {
      alert('Invalid credentials');
    }
  }

  onSignup() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const result = this.userService.signup(this.username, this.password, this.email);
    if (result.success) {
      alert(result.message + '. You can now login.');
      this.toggleMode();
      this.clearForm();
    } else {
      alert(result.message);
    }
  }

  onResetPassword() {
    if (!this.email) {
      alert('Please enter your email address');
      return;
    }

    
    const result = this.userService.resetPassword(this.email);
    if (result.success) {
      this.successMessage = result.message;
      setTimeout(() => {
        this.backToLogin();
      }, 3000);
    } else {
      alert(result.message);
    }
  }

  showForgotPassword() {
    this.isForgotPasswordMode = true;
    this.isSignupMode = false;
    this.successMessage = '';
    this.clearForm();
  }

  backToLogin() {
    this.isForgotPasswordMode = false;
    this.isSignupMode = false;
    this.successMessage = '';
    this.clearForm();
  }

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
    this.isForgotPasswordMode = false;
    this.successMessage = '';
    this.clearForm();
  }

  clearForm() {
    this.username = '';
    this.password = '';
    this.email = '';
    this.confirmPassword = '';
  }
}