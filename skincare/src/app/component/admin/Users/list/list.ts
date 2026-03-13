

import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { UsersService } from '../../../../service/user';
import { User } from '../../../../models/user';

declare const $: any;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users: Observable<User[]> = this.usersSubject.asObservable();
  errorMessage: string = '';

  constructor(
    private userService: UsersService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.loadusers();
  }

  loadusers() {
    this.userService.getAllUsers().subscribe({
      next: (data: any) => {
        const usersData = data.data || data;
        this.usersSubject.next(usersData);
        this.cdr.detectChanges(); // This ensures rows are rendered before DataTables starts

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#users-table')) {
            this.initDataTable();}
          }, 100);
        }
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined') {
      return;
    }

    if ($.fn.DataTable.isDataTable('#users-table')) {
      $('#users-table').DataTable().destroy();
    }

    $('#users-table').DataTable({
      columnDefs: [{ orderable: false, targets: [4, 5, 6] }]
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        // next: () => {
        this.loadusers();
        // },
        // error: (err: any) => {
        //   console.error('Error deleting user:', err);
        // }
      });
    }
  }
}
