import { Component } from '@angular/core';
import { Header as AppHeader } from '../../layout/header/header';
import { Sidebar as AppSidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-edit',
  imports: [AppHeader, AppSidebar],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit { }
