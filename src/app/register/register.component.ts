import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    birth: [''],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = "Please fill out all required fields correctly.";
      return;
    }

    const rawForm = this.form.getRawValue();
    const payload = {
      ...rawForm,
      birth: rawForm.birth ? rawForm.birth : null,
    };

    console.log('Checking existence for username:', payload.username);

    this.authService.checkUserExists(payload.username).subscribe({
      next: (exists) => {
        console.log('User exists:', exists);
        if (exists) {
          this.errorMessage = "User already exists. Please try a different username or email.";
        } else {
          this.http.post('/api/users', payload).subscribe({
            next: () => {
              console.log('User registered successfully');
              this.router.navigateByUrl('/home');
            },
            error: (err) => {
              console.error('Registration error:', err);
              if (err.status === 400) {
                this.errorMessage = "Invalid data. Please check your input.";
              } else if (err.status === 500) {
                this.errorMessage = "Registration failed. Please try again later.";
              } else {
                this.errorMessage = "Registration failed. Please try again later.";
              }
            },
          });
        }
      },
      error: (err) => {
        console.error('Error checking user existence:', err);
        this.errorMessage = "Failed to check user existence. Please try again later.";
      }
    });
  }

  onLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
