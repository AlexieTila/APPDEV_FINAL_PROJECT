import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User, Folder } from '../../models/user.model';
import { FolderDialog } from '../folder-dialog/folder-dialog';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule
  ],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfile implements OnInit {
  user: User | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  createFolder() {
    const dialogRef = this.dialog.open(FolderDialog, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.createFolder(result.title, result.description);
        this.user = this.userService.getCurrentUser();
      }
    });
  }

  editFolder(folder: Folder) {
    const dialogRef = this.dialog.open(FolderDialog, {
      width: '500px',
      data: { mode: 'edit', folder }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateFolder(folder.id, result.title, result.description);
        this.user = this.userService.getCurrentUser();
      }
    });
  }

  deleteFolder(folder: Folder) {
    if (confirm(`Are you sure you want to delete "${folder.title}"?`)) {
      this.userService.deleteFolder(folder.id);
      this.user = this.userService.getCurrentUser();
    }
  }

  getTotalMoviesInFolders(): number {
    if (!this.user || !this.user.folders) return 0;
    return this.user.folders.reduce((total, folder) => total + folder.movies.length, 0);
  }

  getMemberSince(): string {
    if (!this.user) return 'Unknown';
    // Since we don't have a registration date, we'll use a placeholder
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }

  clearAllData() {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.clear();
      this.userService.logout();
      this.router.navigate(['/login']);
    }
  }

  exportData() {
    if (!this.user) return;
    
    const dataStr = JSON.stringify(this.user, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cinemahub-data-${this.user.username}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onProfilePictureChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result && this.user) {
          this.user.profilePicture = e.target.result as string;
          this.userService.updateProfilePicture(e.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
