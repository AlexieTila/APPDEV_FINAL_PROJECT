import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { FolderService } from '../../services/folder.service';
import { MovieService } from '../../services/movie.service';
import { Folder } from '../../interfaces/folder.interface';
import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-folders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent implements OnInit {
  folders: Folder[] = [];
  folderForm: FormGroup;
  editingFolder: Folder | null = null;
  loading = true;
  showCreateForm = false;
  folderMovies: { [folderId: string]: Movie[] } = {};

  colors = [
    '#3f51b5', '#e91e63', '#9c27b0', '#673ab7',
    '#2196f3', '#00bcd4', '#009688', '#4caf50',
    '#ff9800', '#ff5722', '#795548', '#607d8b'
  ];

  constructor(
    private folderService: FolderService,
    private movieService: MovieService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.folderForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      color: ['#3f51b5']
    });
  }

  ngOnInit(): void {
    this.loadFolders();
  }

  loadFolders(): void {
    this.folderService.getFolders().subscribe(folders => {
      this.folders = folders;
      this.loading = false;

      // Load movies for each folder
      folders.forEach(folder => {
        this.loadFolderMovies(folder.id);
      });
    });
  }

  loadFolderMovies(folderId: string): void {
    this.folderService.getMoviesInFolder(folderId).subscribe(movieIds => {
      if (movieIds.length > 0) {
        // Load actual movie data
        const movies: Movie[] = [];
        movieIds.forEach(movieId => {
          this.movieService.getMovieById(movieId).subscribe(movie => {
            movies.push(movie);
            this.folderMovies[folderId] = [...movies];
          });
        });
      } else {
        this.folderMovies[folderId] = [];
      }
    });
  }

  createFolder(): void {
    if (this.folderForm.invalid) return;

    const formValue = this.folderForm.value;
    this.folderService.createFolder(formValue).subscribe(folder => {
      this.folders.push(folder);
      this.folderForm.reset({ color: '#3f51b5' });
      this.showCreateForm = false;
      this.folderMovies[folder.id] = [];
    });
  }

  startEdit(folder: Folder): void {
    this.editingFolder = folder;
    this.folderForm.patchValue({
      name: folder.name,
      description: folder.description,
      color: folder.color
    });
    this.showCreateForm = true;
  }

  updateFolder(): void {
    if (this.folderForm.invalid || !this.editingFolder) return;

    const formValue = this.folderForm.value;
    this.folderService.updateFolder({
      id: this.editingFolder.id,
      ...formValue
    }).subscribe(updatedFolder => {
      const index = this.folders.findIndex(f => f.id === updatedFolder.id);
      if (index >= 0) {
        this.folders[index] = updatedFolder;
      }
      this.cancelEdit();
    });
  }

  cancelEdit(): void {
    this.editingFolder = null;
    this.folderForm.reset({ color: '#3f51b5' });
    this.showCreateForm = false;
  }

  deleteFolder(folder: Folder, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${folder.name}"?`)) {
      this.folderService.deleteFolder(folder.id).subscribe(() => {
        this.folders = this.folders.filter(f => f.id !== folder.id);
        delete this.folderMovies[folder.id];
      });
    }
  }

  removeMovieFromFolder(folderId: string, movieId: string, event: Event): void {
    event.stopPropagation();
    this.folderService.removeMovieFromFolder(folderId, movieId).subscribe(() => {
      this.folderMovies[folderId] = this.folderMovies[folderId].filter(m => m.id !== movieId);
    });
  }

  viewMovie(movieId: string): void {
    this.router.navigate(['/movie', movieId]);
  }

  getFolderMovieCount(folderId: string): number {
    return this.folderMovies[folderId]?.length || 0;
  }

  getFolderMovies(folderId: string): Movie[] {
    return this.folderMovies[folderId] || [];
  }
}
