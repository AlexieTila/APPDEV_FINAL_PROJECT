import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Review as ReviewModel } from '../../models/user.model';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './review.html',
  styleUrls: ['./review.scss']
})
export class Review {
  @Input() reviews: ReviewModel[] = [];
  @Output() addReview = new EventEmitter<ReviewModel>();
  reviewText = '';
  comment = '';
  rating: 'thumbs_up' | 'thumbs_down' = 'thumbs_up';

  onSubmit() {
    // Assume movieId and userId are passed or handled elsewhere
    this.addReview.emit({ id: Date.now(), movieId: 0, userId: 0, rating: this.rating, comment: this.comment });
  }
}
