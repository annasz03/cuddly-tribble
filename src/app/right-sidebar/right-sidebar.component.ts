import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Users } from '../types'; 
import { UsersService } from '../users.service'; 

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent implements OnInit {
  users: Users[] = [];

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  getUserById(id: string): Users | undefined {
    return this.users.find(user => user.id === id);
  }

  
}
