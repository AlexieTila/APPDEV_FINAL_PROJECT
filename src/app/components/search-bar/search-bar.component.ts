import { Component, Output, EventEmitter } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { combineLatest, startWith } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSelectModule]
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  yearControl = new FormControl('');
  genreControl = new FormControl('');
  @Output() filters = new EventEmitter<{ title: string; year?: string; genre?: string }>();

  constructor() {
    const title$ = this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged());
    const year$ = this.yearControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged());
    const genre$ = this.genreControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged());
    combineLatest([title$, year$, genre$]).subscribe(([title, year, genre]) => {
      const payload: { title: string; year?: string; genre?: string } = { title: (title ?? '').toString().trim() };
      const y = (year ?? '').toString().trim();
      const g = (genre ?? '').toString().trim();
      if (y) payload.year = y;
      if (g) payload.genre = g;
      this.filters.emit(payload);
    });
  }
}