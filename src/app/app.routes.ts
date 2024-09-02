import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import { LogicComponent } from './login/login.component';
import { AuthGuard } from './authguard.service';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LogicComponent },
  { path: 'post/:id', component: PostComponent, pathMatch: 'full' },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'users/:id', component:ProfileComponent }
];
