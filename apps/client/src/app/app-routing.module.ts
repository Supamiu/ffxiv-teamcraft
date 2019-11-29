import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevGuard } from './core/guard/dev.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'recipes',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'lists',
    loadChildren: () => import('./pages/lists/lists-page.module').then(m => m.ListsPageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/list-details/list-details.module').then(m => m.ListDetailsModule)
  },
  {
    path: 'workshop',
    loadChildren: () => import('./pages/workshop-details/workshop-details.module').then(m => m.WorkshopDetailsModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'gathering-location',
    loadChildren: () => import('./pages/gathering-location/gathering-location.module').then(m => m.GatheringLocationModule)
  },
  {
    path: 'gc-supply',
    loadChildren: () => import('./pages/gc-supply/gc-supply.module').then(m => m.GcSupplyModule)
  },
  {
    path: 'levequests',
    loadChildren: () => import('./pages/levequests/levequests.module').then(m => m.LevequestsModule)
  },
  {
    path: 'log-tracker',
    loadChildren: () => import('./pages/log-tracker/log-tracker.module').then(m => m.LogTrackerModule)
  },
  {
    path: 'alarms',
    loadChildren: () => import('./pages/alarms-page/alarms-page.module').then(m => m.AlarmsPageModule)
  },
  {
    path: 'alarms-overlay',
    loadChildren: () => import('./pages/alarms-overlay/alarms-overlay.module').then(m => m.AlarmsOverlayModule)
  },
  {
    path: 'rotation-overlay',
    loadChildren: () => import('./pages/rotation-overlay/rotation-overlay.module').then(m => m.RotationOverlayModule)
  },
  {
    path: 'community-lists',
    loadChildren: () => import('./pages/community-lists/community-lists.module').then(m => m.CommunityListsModule)
  },
  {
    path: 'teams',
    loadChildren: () => import('./pages/teams-pages/teams-pages.module').then(m => m.TeamsPagesModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./pages/favorites-page/favorites-page.module').then(m => m.FavoritesPageModule)
  },
  {
    path: 'macro-translator',
    loadChildren: () => import('./pages/macro-translator/macro-translator.module').then(m => m.MacroTranslatorModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'import',
    loadChildren: () => import('./pages/import/import.module').then(m => m.ImportModule)
  },
  {
    path: 'patreon-redirect',
    loadChildren: () => import('./pages/patreon-redirect/patreon-redirect.module').then(m => m.PatreonRedirectModule)
  },
  {
    path: 'list-import/:importString',
    redirectTo: 'import/:importString'
  },
  {
    path: 'custom-links',
    loadChildren: () => import('./pages/custom-links/custom-links-page.module').then(m => m.CustomLinksPageModule)
  },
  {
    path: 'link',
    loadChildren: () => import('./pages/link/link.module').then(m => m.LinkModule)
  },
  {
    path: 'template',
    loadChildren: () => import('./pages/template/template.module').then(m => m.TemplateModule)
  },
  {
    path: 'custom-items',
    loadChildren: () => import('./pages/custom-items/custom-items-page.module').then(m => m.CustomItemsPageModule)
  },
  {
    path: 'desynth',
    loadChildren: () => import('./pages/desynth/desynth.module').then(m => m.DesynthModule)
  },
  {
    path: 'support-us',
    loadChildren: () => import('./pages/support-us/support-us.module').then(m => m.SupportUsModule)
  },
  {
    path: 'db',
    loadChildren: () => import('./pages/db/db.module').then(m => m.DbModule)
  },
  {
    path: 'recipe-finder',
    loadChildren: () => import('./pages/recipe-finder/recipe-finder.module').then(m => m.RecipeFinderModule)
  },
  {
    path: 'currency-spending',
    loadChildren: () => import('./pages/currency-spending/currency-spending.module').then(m => m.CurrencySpendingModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule)
  },
  {
    path: 'reset-timers',
    loadChildren: () => import('./pages/reset-timers/reset-timers.module').then(m => m.ResetTimersModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./pages/inventory/inventory-page.module').then(m => m.InventoryPageModule)
  },
  {
    path: 'inventory-optimizer',
    loadChildren: () => import('./pages/inventory-optimizer/inventory-optimizer.module').then(m => m.InventoryOptimizerModule)
  },
  {
    path: 'extractor',
    loadChildren: () => import('./pages/extractor/extractor.module').then(m => m.ExtractorModule),
    canLoad: [DevGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
