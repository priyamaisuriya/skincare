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
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
