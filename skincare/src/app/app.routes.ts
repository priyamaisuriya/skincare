import { Routes } from '@angular/router';
import { Sidebar } from './component/admin/layout/sidebar/sidebar';
import { Header } from './component/admin/layout/header/header';
import { Layout } from './component/admin/layout/layout';
import { List } from './component/admin/Sliders/list/list';
import { Edit } from './component/admin/Sliders/edit/edit';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: 'sidebar', component: Sidebar },
            { path: 'header', component: Header },
            { path: 'admin/slider', component: List },
            { path: 'admin/slider/create', component: Edit },
            { path: 'admin/slider/edit/:id', component: Edit }
        ]
    }
];
