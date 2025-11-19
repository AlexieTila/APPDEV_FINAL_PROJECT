import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Folder, CreateFolderRequest, UpdateFolderRequest } from '../interfaces/folder.interface';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private apiUrl = '/api/folders'; // Update with your actual API URL
  private foldersSubject = new BehaviorSubject<Folder[]>([]);
  public folders$ = this.foldersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFoldersFromStorage();
  }

  private loadFoldersFromStorage(): void {
    const stored = localStorage.getItem('folders');
    if (stored) {
      const folders = JSON.parse(stored);
      this.foldersSubject.next(folders);
    }
  }

  private saveFoldersToStorage(folders: Folder[]): void {
    localStorage.setItem('folders', JSON.stringify(folders));
  }

  getFolders(): Observable<Folder[]> {
    // Simulated API call
    return of(this.foldersSubject.value);
    // Actual implementation:
    // return this.http.get<Folder[]>(this.apiUrl).pipe(
    //   tap(folders => this.foldersSubject.next(folders))
    // );
  }

  getFolderById(id: string): Observable<Folder | undefined> {
    const folder = this.foldersSubject.value.find(f => f.id === id);
    return of(folder);
    // Actual implementation:
    // return this.http.get<Folder>(`${this.apiUrl}/${id}`);
  }

  createFolder(request: CreateFolderRequest): Observable<Folder> {
    const newFolder: Folder = {
      id: Date.now().toString(),
      userId: '1', // Should come from auth service
      name: request.name,
      description: request.description,
      movieIds: [],
      createdAt: new Date(),
      color: request.color || '#3f51b5',
      isPublic: request.isPublic || false
    };

    const folders = [...this.foldersSubject.value, newFolder];
    this.foldersSubject.next(folders);
    this.saveFoldersToStorage(folders);

    return of(newFolder);
    // Actual implementation:
    // return this.http.post<Folder>(this.apiUrl, request).pipe(
    //   tap(folder => {
    //     const folders = [...this.foldersSubject.value, folder];
    //     this.foldersSubject.next(folders);
    //   })
    // );
  }

  updateFolder(request: UpdateFolderRequest): Observable<Folder> {
    const folders = this.foldersSubject.value.map(folder => {
      if (folder.id === request.id) {
        return {
          ...folder,
          ...request,
          updatedAt: new Date()
        };
      }
      return folder;
    });

    this.foldersSubject.next(folders);
    this.saveFoldersToStorage(folders);

    const updatedFolder = folders.find(f => f.id === request.id)!;
    return of(updatedFolder);
    // Actual implementation:
    // return this.http.put<Folder>(`${this.apiUrl}/${request.id}`, request).pipe(
    //   tap(updatedFolder => {
    //     const folders = this.foldersSubject.value.map(f =>
    //       f.id === updatedFolder.id ? updatedFolder : f
    //     );
    //     this.foldersSubject.next(folders);
    //   })
    // );
  }

  deleteFolder(id: string): Observable<void> {
    const folders = this.foldersSubject.value.filter(f => f.id !== id);
    this.foldersSubject.next(folders);
    this.saveFoldersToStorage(folders);

    return of(void 0);
    // Actual implementation:
    // return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    //   tap(() => {
    //     const folders = this.foldersSubject.value.filter(f => f.id !== id);
    //     this.foldersSubject.next(folders);
    //   })
    // );
  }

  addMovieToFolder(folderId: string, movieId: string): Observable<Folder> {
    const folders = this.foldersSubject.value.map(folder => {
      if (folder.id === folderId && !folder.movieIds.includes(movieId)) {
        return {
          ...folder,
          movieIds: [...folder.movieIds, movieId],
          updatedAt: new Date()
        };
      }
      return folder;
    });

    this.foldersSubject.next(folders);
    this.saveFoldersToStorage(folders);

    const updatedFolder = folders.find(f => f.id === folderId)!;
    return of(updatedFolder);
    // Actual implementation:
    // return this.http.post<Folder>(`${this.apiUrl}/${folderId}/movies/${movieId}`, {}).pipe(
    //   tap(updatedFolder => {
    //     const folders = this.foldersSubject.value.map(f =>
    //       f.id === updatedFolder.id ? updatedFolder : f
    //     );
    //     this.foldersSubject.next(folders);
    //   })
    // );
  }

  removeMovieFromFolder(folderId: string, movieId: string): Observable<Folder> {
    const folders = this.foldersSubject.value.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          movieIds: folder.movieIds.filter(id => id !== movieId),
          updatedAt: new Date()
        };
      }
      return folder;
    });

    this.foldersSubject.next(folders);
    this.saveFoldersToStorage(folders);

    const updatedFolder = folders.find(f => f.id === folderId)!;
    return of(updatedFolder);
    // Actual implementation:
    // return this.http.delete<Folder>(`${this.apiUrl}/${folderId}/movies/${movieId}`).pipe(
    //   tap(updatedFolder => {
    //     const folders = this.foldersSubject.value.map(f =>
    //       f.id === updatedFolder.id ? updatedFolder : f
    //     );
    //     this.foldersSubject.next(folders);
    //   })
    // );
  }

  getMoviesInFolder(folderId: string): Observable<string[]> {
    const folder = this.foldersSubject.value.find(f => f.id === folderId);
    return of(folder?.movieIds || []);
  }
}
