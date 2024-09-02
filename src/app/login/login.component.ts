import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class LogicComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = "Please fill out all required fields correctly.";
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password).subscribe({
      next: () => {
        console.log('User logged in successfully');
        console.log("wawa");
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.status === 401) {
          this.errorMessage = "Invalid email or password.";
        } else if (err.status === 500) {
          this.errorMessage = "Login failed. Please try again later.";
        } else {
          this.errorMessage = "Login failed. Please try again later.";
        }
      },
    });
  }

  onRegister(): void {
    this.router.navigateByUrl('/register');
  }
}
