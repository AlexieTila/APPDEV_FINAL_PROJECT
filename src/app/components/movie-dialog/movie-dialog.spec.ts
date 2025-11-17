import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDialog } from './movie-dialog';

describe('MovieDialog', () => {
  let component: MovieDialog;
  let fixture: ComponentFixture<MovieDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
