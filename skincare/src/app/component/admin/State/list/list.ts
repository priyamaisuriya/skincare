import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../../service/state';
import { State } from '../../../../models/state'
@Component({
  selector: 'app-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  state: State[] = [];

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.loadStates();
  }
  loadStates(): void {
    this.stateService.getAllStates().subscribe({
      next: (data) => {
        this.state = data;
        console.log('data.', data)
      },
      error: (err) => {
        console.error('Error loading states:', err);
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
          console.error('Error deleting state:', err);
        }
      });
    }
  }
}
