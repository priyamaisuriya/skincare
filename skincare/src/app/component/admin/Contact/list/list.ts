import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContactService } from '../../../../service/contact';
import { Contact } from '../../../../models/contact';


declare const $: any;

@Component({
  selector: 'app-list',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();

  constructor(
    private contactService: ContactService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadContacts();
    }
  }

  loadContacts(): void {
    this.contactService.getAllContacts().subscribe({
      next: (data: any) => {
        const contactsData = data.data || data;
        this.contactsSubject.next(contactsData);
        this.cdr.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#contacts-table')) {
              this.initDataTable();
            }
           
          }, 100);
        }
      },
      error: (err) => {
        console.error('Error loading contacts:', err);
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined') {
      return;
    }

    if ($.fn.DataTable.isDataTable('#contacts-table')) {
      $('#contacts-table').DataTable().destroy();
    }

    $('#contacts-table').DataTable({
      columnDefs: [{ orderable: false, targets: [7] }]
    });
  }

  deleteContact(id: number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe({
        next: () => {
          this.loadContacts();
        },
        error: (err) => {
          console.error('Error deleting contact:', err);
        }
      });
    }
  }
}
