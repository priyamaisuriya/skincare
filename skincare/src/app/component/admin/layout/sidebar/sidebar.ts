import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../service/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}