import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './filter.html',
  styleUrls: ['./filter.scss']
})
export class Filter {
  @Output() filter = new EventEmitter<{ genre: string; year: string }>();
  genre = '';
  year = '';

  onFilter() {
    this.filter.emit({ genre: this.genre, year: this.year });
  }
}
