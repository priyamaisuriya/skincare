import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header as AppHeader } from '../../layout/header/header';
import { Sidebar as AppSidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-edit',
  imports: [AppHeader, AppSidebar, RouterLink, FormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit {

}
