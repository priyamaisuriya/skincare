import { Routes } from '@angular/router';
import { Sidebar } from './component/admin/layout/sidebar/sidebar';
import { Header } from './component/admin/layout/header/header';
import { Layout } from './component/admin/layout/layout';
import { List as CourierList } from './component/admin/Couriers/list/list';
import { CourierEdit } from './component/admin/Couriers/edit/edit';
import { List as UserList } from './component/admin/Users/list/list';
import { UserEdit } from './component/admin/Users/edit/edit';

import { List as SliderList } from './component/admin/Sliders/list/list';
import { Edit as SliderEdit } from './component/admin/Sliders/edit/edit';
import { CompanySettingsEdit } from './component/admin/CompanySettings/edit/edit';
import { List as CategoriesList } from './component/admin/Categories/list/list';
import { CategoriesEdit } from './component/admin/Categories/edit/edit';
import { List as OrderList } from './component/admin/Order/list/list';
import { Edit as OrderEdit } from './component/admin/Order/edit/edit';
import { Show as OrderShow } from './component/admin/Order/show/show';


import { List as FaqList } from './component/admin/FAQ/list/list';
import { Edit as FaqEdit } from './component/admin/FAQ/edit/edit';
import { List as ContactList } from './component/admin/Contact/list/list';
import { Edit as ContactEdit } from './component/admin/Contact/edit/edit';
import { List as ProductList } from './component/admin/Product/list/list';
import { Edit as ProductEdit } from './component/admin/Product/edit/edit';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: 'sidebar', component: Sidebar },
            { path: 'header', component: Header },
            { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },

            // { path: 'admin/slider', component: List },
            // { path: 'admin/slider/create', component: Edit },
            // { path: 'admin/slider/edit/:id', component: Edit },

            { path: 'admin/courier', component: CourierList },
            { path: 'admin/courier/create', component: CourierEdit },
            { path: 'admin/courier/edit/:id', component: CourierEdit },

            { path: 'admin/user', component: UserList },
            { path: 'admin/user/create', component: UserEdit },
            { path: 'admin/user/edit/:id', component: UserEdit },

            { path: 'admin/slider', component: SliderList },
            { path: 'admin/slider/create', component: SliderEdit },
            { path: 'admin/slider/edit/:id', component: SliderEdit },

            { path: 'admin/CompanySettings/edit', component: CompanySettingsEdit },

            { path: 'admin/categories', component: CategoriesList },
            { path: 'admin/categories/create', component: CategoriesEdit },
            { path: 'admin/categories/edit/:id', component: CategoriesEdit },

            { path: 'admin/orders', component: OrderList },
            { path: 'admin/order/create', component: OrderEdit },
            { path: 'admin/order/show/:id', component: OrderShow },
            { path: 'admin/order/edit/:id', component: OrderEdit },


            { path: 'admin/faq', component: FaqList },
            { path: 'admin/faq/create', component: FaqEdit },
            { path: 'admin/faq/edit/:id', component: FaqEdit },

            { path: 'admin/contacts', component: ContactList },
            { path: 'admin/contacts/create', component: ContactEdit },
            { path: 'admin/contacts/edit/:id', component: ContactEdit },

            { path: 'admin/products', component: ProductList },
            { path: 'admin/products/create', component: ProductEdit },
            { path: 'admin/products/edit/:id', component: ProductEdit },

        ]
    },
    // {path : '/shop',component: ShopComponent}
];
