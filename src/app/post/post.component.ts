import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../posts.service';
import { Post } from '../post.interface';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  post: Post | null = null;

  constructor(private route: ActivatedRoute, private postsService: PostsService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.postsService.getPostById(id).subscribe(post => {
          this.post = post;
          this.postsService.addViewToPost(post.id).subscribe(() => {
            console.log('View added to post');
          });
        });
      }
    });
  }
}
