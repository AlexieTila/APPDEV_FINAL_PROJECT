import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Folder as FolderModel } from '../../models/user.model';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './folder.html',
  styleUrls: ['./folder.scss']
})
export class Folder {
  @Input() folder!: FolderModel;
}
