import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SliderService } from '../../../../service/slider';
import { Slider } from '../../../../models/slider';




@Component({
  selector: 'app-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  sliders: Slider[] = [];
  constructor(private sliderService: SliderService) { }

  ngOnInit(): void {
    this.loadSliders();
  }

  loadSliders(): void {
    this.sliderService.getAllSliders().subscribe({
      next: (data) => {
        this.sliders = data;
        console.log('data.', data)

      },
      error: (err) => {
        console.error('Error loading sliders:', err);
      }
    });
  }

  deleteSlider(id: number): void {
    if (confirm('Are you sure you want to delete this slider?')) {
      this.sliderService.deleteSlider(id).subscribe({
        next: () => {
          this.loadSliders();
        },
        error: (err) => {
          console.error('Error deleting slider:', err);
        }
      });
    }
  }
}
