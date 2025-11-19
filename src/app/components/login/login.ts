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
  username = '';
  password = '';
  email = '';
  confirmPassword = '';

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

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
    this.clearForm();
  }

  clearForm() {
    this.username = '';
    this.password = '';
    this.email = '';
    this.confirmPassword = '';
  }
}
