import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../../service/contact';
import { Contact } from '../../../../models/contact';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  contacts: Contact[] = [];
  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getAllContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        console.log('data.', data)

      },
      error: (err) => {
        console.error('Error loading contacts:', err);
      }
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
