

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../service/user';
import { User } from '../../../../models/user';


@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule],

  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  users: User[] = [];
  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.loadusers();
  }

  loadusers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(this.users);
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
      }
    });
  }
  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadusers();
        },
        error: (err: any) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }
}
