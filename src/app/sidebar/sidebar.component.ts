import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
