import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../services/user.service';
import { Movie, Folder } from '../../models/user.model';
import { FolderDialog } from '../folder-dialog/folder-dialog';

export interface AddToFolderDialogData {
  movie: Movie;
}

@Component({
  selector: 'app-add-to-folder-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './add-to-folder-dialog.html',
  styleUrls: ['./add-to-folder-dialog.scss']
})
export class AddToFolderDialog implements OnInit {
  folders: Folder[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddToFolderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddToFolderDialogData,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadFolders();
  }

  loadFolders() {
    this.folders = this.userService.getFolders();
  }

  selectFolder(folder: Folder) {
    this.userService.addToFolder(folder.id, this.data.movie);
    this.dialogRef.close({ success: true, folder });
  }

  createNewFolder() {
    const dialogRef = this.dialog.open(FolderDialog, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newFolder = this.userService.createFolder(result.title, result.description);
        if (newFolder) {
          this.loadFolders();
          // Automatically add movie to the newly created folder
          this.userService.addToFolder(newFolder.id, this.data.movie);
          this.dialogRef.close({ success: true, folder: newFolder });
        }
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
