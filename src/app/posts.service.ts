import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.interface';
import { tap, catchError } from 'rxjs/operators';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();
  
  private usersSubject = new BehaviorSubject<UserInterface[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPosts();
    this.loadUsers();
  }

  loadPosts(): void {
    this.http.get<Post[]>('/api/posts').subscribe({
      next: (data) => {
        console.log('Loaded posts:', data);
        this.postsSubject.next(data);
      },
      error: (err) => console.error('Error loading posts:', err)
    });
  }
  

  getPosts(): Observable<Post[]> {
    return this.posts$;
  }

savePost(post: Post): Observable<any> {
  return this.http.post('/api/posts', post).pipe(
    tap(() => {
      console.log('Refreshing posts...');
      this.loadPosts(); 
    }),
    catchError(err => {
      console.error('Error saving post:', err);
      return throwError(() => new Error('Error saving post')); 
    })
  );
}


  loadUsers(): void {
    this.http.get<UserInterface[]>('/api/users').subscribe({
      next: (data) => this.usersSubject.next(data),
      error: (err) => console.error('Error loading users:', err)
    });
  }

  getUsers(): Observable<UserInterface[]> {
    return this.users$;
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`/api/posts/${id}`).pipe(
      catchError(err => {
        console.error(`Error fetching post with ID ${id}:`, err);
        return throwError(() => new Error(`Error fetching post with ID ${id}`));
      })
    );
  }

  addViewToPost(id: string): Observable<void> {
    return this.http.post<void>(`/api/posts/${id}/view`, {}).pipe(
      catchError(err => {
        console.error(`Error adding view to post with ID ${id}:`, err);
        return throwError(() => new Error(`Error adding view to post with ID ${id}`));
      })
    );
  }

  likePost(postId: string): Observable<Post> {
    return this.http.post<Post>(`/api/posts/${postId}/add-like`, {});
  }

}
