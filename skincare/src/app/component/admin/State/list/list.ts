import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { StateService } from '../../../../service/state';
import { State } from '../../../../models/state';

declare const $: any;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  private statesSubject = new BehaviorSubject<State[]>([]);
  states$: Observable<State[]> = this.statesSubject.asObservable();
  loading: boolean = true;

  constructor(
    private stateService: StateService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStates();
    }
  }

  loadStates(): void {
    this.loading = true;
    this.stateService.getAllStates().subscribe({
      next: (response: any) => {
        console.log('States List - API Response:', response);
        const data = response.data || response;
        const statesData = Array.isArray(data) ? data : [];
        this.statesSubject.next(statesData);
        this.loading = false;
        this.cdr.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            if (isPlatformBrowser(this.platformId) && typeof $ !== 'undefined' && $.fn.DataTable) {
              if (!$.fn.DataTable.isDataTable('#states-table')) {
                this.initDataTable();
              }
            }
          }, 300);
        }
      },
      error: (err) => {
        console.error('States List - Error loading data:', err);
        this.statesSubject.next([]);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined' || !$.fn.DataTable) {
      return;
    }

    if ($.fn.DataTable.isDataTable('#states-table')) {
      $('#states-table').DataTable().destroy();
    }

    $('#states-table').DataTable({
      columnDefs: [{ orderable: false, targets: [3] }],
      language: {
        emptyTable: "No states found."
      }
    });
  }

  deleteState(id: number): void {
    if (confirm('Are you sure you want to delete this state?')) {
      this.stateService.deleteState(id).subscribe({
        next: () => {
          this.loadStates();
        },
        error: (err) => {
          console.error('States List - Error deleting record:', err);
          alert('Failed to delete state.');
        }
      });
    }
  }
}
