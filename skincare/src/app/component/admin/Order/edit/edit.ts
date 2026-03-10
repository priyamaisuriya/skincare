import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit {

}
