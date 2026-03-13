import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SliderService } from '../../../../service/slider';
import { Slider } from '../../../../models/slider';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

declare const $: any;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  private slidersSubject = new BehaviorSubject<Slider[]>([]);
  sliders$: Observable<Slider[]> = this.slidersSubject.asObservable();

  constructor(
    private sliderService: SliderService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.loadSliders();
  }

  loadSliders(): void {
    this.sliderService.getAllSliders().subscribe({
      next: (data: any) => {
        const slidersData = data.data || data;
        this.slidersSubject.next(slidersData);
        this.cdr.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#sliders-table')) {
              this.initDataTable();
            }
           
          }, 100);
        }
      },
      error: (err) => {
        console.error('Error loading sliders:', err);
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined') {
      return;
    }

    if ($.fn.DataTable.isDataTable('#sliders-table')) {
      $('#sliders-table').DataTable().destroy();
    }

    $('#sliders-table').DataTable({
      columnDefs: [{ orderable: false, targets: [2, 5, 6] }]
    });
  }

  deleteSlider(id: number): void {
    if (confirm('Are you sure you want to delete this slider?')) {
      this.sliderService.deleteSlider(id).subscribe({
        next: () => {
          alert('Slider deleted successfully!');
          this.loadSliders();
        },
        error: (err) => {
          console.error('Error deleting slider:', err);
          alert('Failed to delete slider.');
        }
      });
    }
  }
}
