import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/courier/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/user/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/slider/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/categories/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/order/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/states/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/faq/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/contacts/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/products/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
