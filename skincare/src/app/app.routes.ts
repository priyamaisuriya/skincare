import { Routes } from '@angular/router';
import { Sidebar } from './component/admin/layout/sidebar/sidebar';
import { Header } from './component/admin/layout/header/header';
import { Layout } from './component/admin/layout/layout';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path : 'sidebar', component: Sidebar},
            { path : 'header', component: Header}
        ]
    }
];
