import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Posts } from '../types';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PostListingComponent } from '../post-listing/post-listing.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { PostsService } from '../posts.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, PostListingComponent, CreatePostComponent, RightSidebarComponent,],
  providers: [HttpClientModule, HttpClient],
})
export class HomepageComponent { 
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);

  posts: Posts[] = [];

  constructor(private postService: PostsService,) {}

  ngOnInit():void {
    this.postService.getPosts().subscribe(posts => this.posts = posts);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
