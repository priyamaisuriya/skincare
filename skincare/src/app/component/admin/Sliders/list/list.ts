import { Component } from '@angular/core';
import { Header as AppHeader } from '../../layout/header/header';
import { Sidebar as AppSidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-list',
  imports: [AppHeader, AppSidebar],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List { }
