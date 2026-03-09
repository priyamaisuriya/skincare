import { Component } from '@angular/core';
import { Header as appHeader } from '../../layout/header/header';
import { Sidebar as appSidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-list',
  imports: [appHeader, appSidebar],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List { }
