import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../posts.service';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Post } from '../post.interface';
import { Users } from '../types';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-post-listing',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './post-listing.component.html',
  styleUrls: ['./post-listing.component.css']
})
export class PostListingComponent implements OnInit {
  posts: Post[] = [];
  users: Users[] = [];
  postsWithUser: (Post & { user?: Users, postImageUrl?: string, liked?: boolean })[] = [];

  constructor(private postService: PostsService, private userService: UsersService) {}

  ngOnInit() {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
      this.updatePostsWithUsers();
    });

    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.updatePostsWithUsers();
    });
  }

  private updatePostsWithUsers() {
    if (this.posts.length && this.users.length) {
      this.postsWithUser = this.posts.map(post => {
        const user = this.users.find(user => user.id === post.postedBy);
        const postPicData = post.postPic && typeof post.postPic === 'object' && 'data' in post.postPic ? post.postPic : null;
  
        return {
          ...post,
          user,
          postImageUrl: this.bufferToImageUrl(postPicData) || undefined,
          like: typeof post.like === 'number' ? post.like : 0 
        };
      });
    }
  }
  

  likePost(postId: string) {
    const postIndex = this.postsWithUser.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      const post = this.postsWithUser[postIndex];
      const newLikedState = !post.liked;

      this.postService.likePost(postId).subscribe(updatedPost => {
        this.postsWithUser[postIndex] = { ...this.postsWithUser[postIndex], 
          like: updatedPost.like,
          liked: newLikedState
        };
      });
    }
  }

  public bufferToImageUrl(buffer: { type: string; data: number[] } | string | null): string | null {
    if (typeof buffer === 'string') {
      return buffer;
    } else if (buffer && buffer.data) {
      const byteArray = new Uint8Array(buffer.data);
      const blob = new Blob([byteArray], { type: buffer.type });
      return URL.createObjectURL(blob);
    }
    return null;
  }
  

  ngOnDestroy() {
    this.postsWithUser.forEach(post => {
      if (post.postImageUrl) {
        URL.revokeObjectURL(post.postImageUrl);
      }
    });
  }
}
