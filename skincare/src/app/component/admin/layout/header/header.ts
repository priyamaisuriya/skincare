import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../service/auth';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  public user: any = { name: '', profile_image: '' };
  public displayName: string = '';
  public userImagePath: string = 'assets/img/avatar/avatar-1.png';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.updateHeaderData();
      console.log('Header user state updated:', this.user);
    });
  }

  private updateHeaderData(): void {
    if (!this.user) {
      this.displayName = '';
      this.userImagePath = 'assets/img/avatar/avatar-1.png';
      return;
    }

    // Set displayName
    this.displayName = this.user.name || (this.user.first_name ? `${this.user.first_name} ${this.user.last_name || ''}` : '');

    // Set userImagePath
    if (this.user.profile_image) {
      this.userImagePath = `http://127.0.0.1:8000/storage/${this.user.profile_image}`;
    } else {
      this.userImagePath = 'assets/img/avatar/avatar-1.png';
    }
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
