import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/status',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./private/home/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'deliver',
    loadChildren: () => import('./private/deliver/deliver.module').then( m => m.DeliverPageModule)
  },
  {
    path: 'signature',
    loadChildren: () => import('./private/signature/signature.module').then( m => m.SignaturePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
