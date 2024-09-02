import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service'; 
import { PostsService } from '../posts.service'; 
import { UserInterface } from '../user.interface';
import { Post } from '../post.interface'; 
import { v4 as uuid } from 'uuid'; 
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  body: string = '';
  selectedFile: string | null = null;
  picFileName: string | null = null;

  constructor(
    private authService: AuthService,
    private postService: PostsService,
    private http: HttpClient
  ) {}
  

  ngOnInit() {
  }

  get currentUser(): UserInterface | null {
    return this.authService.getCurrentUser();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.picFileName = file.name; 

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFile = reader.result as string;
      };
      reader.readAsDataURL(file); 
    }
  }

  onPost() {
    const postBody = this.body.trim();
    if (!postBody) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
const post: Post = {
  id: uuid(),
  postBody: postBody,
  like: 0,
  comment: 0,
  postedBy: currentUser?.id || 'A',
  date: new Date(),
  views: 0,
  postPic: this.selectedFile,
  picFileName: this.picFileName || 'unknown',
  postImage: new Blob(),
};


    console.log(currentUser?.id);
    this.savePost(post);
}

savePost(post: Post) {
    this.http.post('/api/posts', post).subscribe(
      response => {
        console.log('Post saved successfully', response);
      },
      error => {
        console.error('Error saving post', error);
      }
    );
}

}
