import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { User, Folder as FolderModel } from '../../models/user.model';
import { Movie } from '../../models/movie.model';
import { MovieCard } from '../movie-card/movie-card';
import { Folder } from '../folder/folder';
import { Favorites } from '../favorites/favorites';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTabsModule, MatButtonModule, MovieCard, Folder, Favorites],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfile implements OnInit {
  user: User | null = null;
  favorites: Movie[] = [];
  folders: FolderModel[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    if (this.user) {
      this.favorites = this.user.favorites;
      this.folders = this.user.folders;
    }
  }

  removeFromFavorites(movieId: number) {
    this.userService.removeFromFavorites(movieId);
    if (this.user) {
      this.favorites = this.user.favorites;
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
