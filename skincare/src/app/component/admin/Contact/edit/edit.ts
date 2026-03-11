import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit implements OnInit {

  contact = signal<any>(null);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.http.get<any>('http://127.0.0.1:8000/api/admin/contacts/' + id)
          .subscribe(res => {
            this.contact.set(res.data);
            console.log('Contact loaded and signal set:', this.contact());
          });
      }
    });
  }
}