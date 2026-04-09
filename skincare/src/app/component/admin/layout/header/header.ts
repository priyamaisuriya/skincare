import { Component, OnInit, signal, ChangeDetectorRef, Inject } from '@angular/core';
import { AuthService } from '../../../../service/auth';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
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
  settings = signal<any>({
    logo: '',
    site_name: '',
    favicon: ''
  });

  constructor(
    private authService: AuthService,
    private router: Router, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.loadSettings();
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.updateHeaderData();

      console.log('Header user state updated:', this.user);
    });
  }
  loadSettings() {
    this.http.get('http://127.0.0.1:8000/api/front/settings/1')
      .subscribe((res: any) => {

        const data = res.data;

        this.settings.set(data);

        if (data.favicon) {
          this.setFavicon('http://127.0.0.1:8000/storage/' + data.favicon);
        }

        this.cdr.markForCheck();
      });
  }

  setFavicon(iconUrl: string) {
    const link: HTMLLinkElement | null = this.document.querySelector('#appFavicon');

    if (link) {
      link.href = iconUrl;
    }
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
