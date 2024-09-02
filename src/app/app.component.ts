import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);

  showLoginForm = false;
  showRegisterForm = false;

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSig.set({
          id: user.id,
          name: user.name || 'Anonymous',
          email: user.email!,
          username: user.username || '',
          profilePic: user.profilePic || null,
          followers: 0 
        });
        this.showLoginForm = false;
        this.showRegisterForm = false;
      } else {
        this.authService.currentUserSig.set(null);
      }
      console.log(this.authService.currentUserSig());
    });
  }

  showLogin() {
    this.showLoginForm = true;
    this.showRegisterForm = false;
    this.router.navigateByUrl('/login');
  }

  showRegister() {
    this.showRegisterForm = true;
    this.showLoginForm = false;
    this.router.navigateByUrl('/register');
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
