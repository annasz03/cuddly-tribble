import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { UserInterface } from '../user.interface';
import { AuthService } from '../auth.service'; 
import { PostsService } from '../posts.service';
import { UsersService } from '../users.service';
import { Post } from '../post.interface';
import { Users } from '../types';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  viewMode: string = 'grid';
  isEditing: boolean = false;
  posts: Post[] = [];
  users: Users[] = [];
  postsWithUser: (Post & { user?: Partial<Users>; postImageUrl?: string })[] = [];
  selectedFile: string | null = null;
  picFileName: string | null = null;
  password: string = '';
  password2: string = '';
  passwordMismatch: boolean = false;
  viewingUser: Users | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private postService: PostsService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.userService.getUserById(userId).subscribe(user => {
          this.viewingUser = user;
          this.loadUserPosts();
        });
      }
    });
  
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.updatePostsWithUsers();
      this.cdr.detectChanges();
    });
  }
  
  private loadUserPosts() {
    if (this.viewingUser) {
      this.postService.getPosts().subscribe(posts => {
        this.posts = posts.filter(post => post.postedBy === this.viewingUser!.id);
        this.updatePostsWithUsers();
        this.cdr.detectChanges();
      });
    }
  }
  

  isLoggedInUserProfile(): boolean {
    return !!(this.currentUser && this.viewingUser && this.currentUser.id === this.viewingUser.id);
  }
  

  setView(view: string) {
    this.viewMode = view;
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }

  get currentUser(): UserInterface | null {
    return this.authService.getCurrentUser();
  }

  saveProfile() {
    this.passwordMismatch = false;

    if (this.password !== this.password2) {
      this.passwordMismatch = true;
      return;
    }

    this.isEditing = false;

    const user = this.currentUser;
    if (user) {
      const updatedUser = this.convertUserInterfaceToUsers(user);

      if (this.password) {
        updatedUser.password = this.password;
      }

      if (Object.keys(updatedUser).length > 0) {
        console.log('Updated user data:', updatedUser);

        const userId = user.id; 

        this.userService.updateUser(updatedUser).subscribe({
          next: updatedUser => {
            this.authService.setCurrentUser(updatedUser);
            this.isEditing = false;
          },
          error: err => {
            console.error('Error updating user data:', err);
            if (err.error) {
              console.error('Server error:', err.error);
            }
          }
        });
      } else {
        console.log('No changes detected, skipping update.');
      }
    }
  }

  private convertUserInterfaceToUsers(user: UserInterface): Partial<Users> {
    const updatedUser: Partial<Users> = {};

    updatedUser.id = user.id;
    if (user.name) updatedUser.name = user.name;
    if (user.birth) updatedUser.birth = this.formatDateForDatabase(new Date(user.birth));
    if (user.profilePic !== null) updatedUser.profilePic = user.profilePic;
    if (user.followers) updatedUser.followers = user.followers;
    if (user.username) updatedUser.username = user.username;
    if (user.created_at) updatedUser.created_at = this.formatDateForDatabase(new Date(user.created_at));
    if (user.password) updatedUser.password = user.password;
    if (user.email) updatedUser.email = user.email;
    if (user.bio) updatedUser.bio = user.bio;

    return updatedUser;
  }

  private formatDateForDatabase(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private updatePostsWithUsers() {
    if (this.posts.length && this.viewingUser) {
      this.postsWithUser = this.posts.map(post => {
        const postPicData = post.postPic && typeof post.postPic === 'object' && 'data' in post.postPic
          ? post.postPic
          : null;
  
        return { 
          ...post, 
          user: this.viewingUser ? { ...this.viewingUser } : undefined, 
          postImageUrl: this.bufferToImageUrl(postPicData) || undefined
        };
      });
      this.cdr.detectChanges();
    }
  }
  

  public bufferToImageUrl(buffer: { type: string; data: number[] } | string | null | undefined): string | null {
    if (typeof buffer === 'string') {
      return buffer;
    }
    if (!buffer) {
      return null;
    }
    const byteArray = new Uint8Array(buffer.data);
    const blob = new Blob([byteArray], { type: buffer.type });
    return URL.createObjectURL(blob);
  }

  handleProfilePicChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.convertFileToBuffer(file).then(buffer => {
        const imageUrl = this.bufferToImageUrl(buffer);
        if (this.viewingUser) {
          this.viewingUser.profilePic = imageUrl || null;
        }
      });
    } else {
      if (this.viewingUser) {
        this.viewingUser.profilePic = null;
      }
    }
  }

  handleHeaderChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.convertFileToBuffer(file).then(buffer => {
        const imageUrl = this.bufferToImageUrl(buffer);
        if (this.viewingUser) {
          this.viewingUser.header = imageUrl || null;
        }
      });
    } else {
      if (this.viewingUser) {
        this.viewingUser.header = null;
      }
    }
  }

  private convertFileToBuffer(file: File): Promise<{ type: string; data: number[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        resolve({ type: file.type, data: Array.from(data) });
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
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

  private hasUserChanged(currentUser: UserInterface, updatedUser: Partial<Users>): boolean {
    const currentUserCopy: Partial<Users> = {
      id: currentUser.id,
      name: currentUser.name,
      birth: currentUser.birth ? this.formatDateForDatabase(new Date(currentUser.birth)) : null,
      profilePic: currentUser.profilePic,
      followers: currentUser.followers,
      username: currentUser.username,
      created_at: currentUser.created_at ? this.formatDateForDatabase(new Date(currentUser.created_at)) : null,
      password: currentUser.password,
      email: currentUser.email,
      bio: currentUser.bio,
    };

    return JSON.stringify(currentUserCopy) !== JSON.stringify(updatedUser);
  }
}
