import { Routes } from '@angular/router';
import { Sidebar } from './component/admin/layout/sidebar/sidebar';
import { Header } from './component/admin/layout/header/header';
import { Layout } from './component/admin/layout/layout';
import { List as SliderList } from './component/admin/Sliders/list/list';
import { Edit as SliderEdit } from './component/admin/Sliders/edit/edit';
import { Edit as CompanySettingEdit } from './component/admin/CompanySettings/edit/edit';
import { List as CategoriesList } from './component/admin/Categories/list/list';
import { Edit as CategoriesEdit } from './component/admin/Categories/edit/edit';
import { List as OrderList } from './component/admin/Order/list/list';
import { Edit as OrderEdit } from './component/admin/Order/edit/edit';
import { List as StateList } from './component/admin/State/list/list';
import { Edit as StateEdit } from './component/admin/State/edit/edit';
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

            { path: 'admin/slider', component: SliderList },
            { path: 'admin/slider/create', component: SliderEdit },
            { path: 'admin/slider/edit/:id', component: SliderEdit },

            { path: 'admin/CompanySettings/edit', component: CompanySettingEdit },

            { path: 'admin/categories', component: CategoriesList },
            { path: 'admin/categories/create', component: CategoriesEdit },
            { path: 'admin/categories/edit/:id', component: CategoriesEdit },

            { path: 'admin/order', component: OrderList },
            { path: 'admin/order/create', component: OrderEdit },
            { path: 'admin/order/edit/:id', component: OrderEdit },

            { path: 'admin/states', component: StateList },
            { path: 'admin/states/create', component: StateEdit },
            { path: 'admin/states/edit/:id', component: StateEdit },

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
    }
];
