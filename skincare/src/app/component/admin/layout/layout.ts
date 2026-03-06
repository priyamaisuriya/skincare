import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar as AppSidebar } from './sidebar/sidebar';
import { Header as AppHeader } from './header/header';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, AppSidebar, AppHeader],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
