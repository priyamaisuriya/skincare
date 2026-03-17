import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../service/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  user: any = { name: '', profile_image: '' };

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      console.log('Header user state updated:', this.user);
    });
  }

  get displayName(): string {
    if (!this.user) return '';
    return this.user.name || (this.user.first_name ? `${this.user.first_name} ${this.user.last_name || ''}` : '');
  }

  get userImagePath(): string {
    if (this.user?.profile_image) {
      return `http://127.0.0.1:8000/storage/${this.user.profile_image}`;
    }
    return 'assets/img/avatar/avatar-1.png';
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
