import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Folder } from '../../models/user.model';

export interface FolderDialogData {
  folder?: Folder;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-folder-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './folder-dialog.html',
  styleUrls: ['./folder-dialog.scss']
})
export class FolderDialog {
  folderName: string;
  folderDescription: string;

  constructor(
    public dialogRef: MatDialogRef<FolderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: FolderDialogData
  ) {
    this.folderName = data.folder?.title || '';
    this.folderDescription = data.folder?.description || '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.folderName.trim()) {
      this.dialogRef.close({
        title: this.folderName.trim(),
        description: this.folderDescription.trim()
      });
    }
  }
}
