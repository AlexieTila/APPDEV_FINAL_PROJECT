import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  user: any;
  searchQuery = '';

  constructor(private router: Router, private userService: UserService) {
    this.user = this.userService.getCurrentUser();
  }

  onSearch() {
    // Emit or navigate to search results; for now, navigate to movies with query
    this.router.navigate(['/movies'], { queryParams: { q: this.searchQuery } });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
