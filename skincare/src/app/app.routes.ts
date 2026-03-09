import { Routes } from '@angular/router';
import { Sidebar } from './component/admin/layout/sidebar/sidebar';
import { Header } from './component/admin/layout/header/header';
import { Layout } from './component/admin/layout/layout';
import { List as CourierList } from './component/admin/Couriers/list/list';
import { Edit as CourierEdit } from './component/admin/Couriers/edit/edit';
import { List as UserList } from './component/admin/Users/list/list';
import { Edit as UserEdit } from './component/admin/Users/edit/edit';


export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: 'sidebar', component: Sidebar },
            { path: 'header', component: Header },

            // { path: 'admin/slider', component: List },
            // { path: 'admin/slider/create', component: Edit },
            // { path: 'admin/slider/edit/:id', component: Edit },

            { path: 'admin/courier', component: CourierList },
            { path: 'admin/courier/create', component: CourierEdit },
            { path: 'admin/courier/edit/:id', component: CourierEdit },

            { path: 'admin/user', component: UserList },
            { path: 'admin/user/create', component: UserEdit },
            { path: 'admin/user/edit/:id', component: UserEdit },


        ]
    }
];
