import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { FaqService } from '../../../../service/faq';
import { Faq } from '../../../../models/faq';

declare const $: any;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class List implements OnInit {
  private faqsSubject = new BehaviorSubject<Faq[]>([]);
  faqs: Observable<Faq[]> = this.faqsSubject.asObservable();
  errorMessage: string = '';

  constructor(
    private faqService: FaqService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.faqService.getAllFaqs().subscribe({
      next: data => {
        this.faqsSubject.next(data);

        if (isPlatformBrowser(this.platformId)) {
          // delay slightly so DOM has updated before invoking jQuery
          setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#faq-table')) {
              this.initDataTable();
            }
            
          }, 0);
        }
      },
      error: err => {
        this.errorMessage = err.message;
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined') {
      return;
    }

    if ($.fn.DataTable.isDataTable('#faq-table')) {
      $('#faq-table').DataTable().destroy();
    }

    $('#faq-table').DataTable({
      columnDefs: [{ orderable: false, targets: [2, 3] }]
    });
  }


  deleteFaq(id: number): void {
    if (confirm('Delete this FAQ?')) {
      this.faqService.deleteFaq(id).subscribe(() => {
        this.loadFaqs();
      });
    }
  }
}