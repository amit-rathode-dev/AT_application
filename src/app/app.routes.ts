import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { FeatureModule } from './components/feature/feature.module';
import { UserRolesComponent } from './components/Masters/user-roles/user-roles.component';
import { AddUserComponent } from './components/Masters/add-user/add-user.component';
import { OrgManagementComponent } from './components/Masters/org-management/org-management.component';
import { RoleManagementComponent } from './components/Masters/role-management/role-management.component';
import { BannerComponent } from './components/Masters/banner/banner.component';
import { AddCategoryComponent } from './components/Masters/Category/add-category/add-category.component';
import { AddFuelComponent } from './components/Masters/add-fuel/add-fuel.component';
import { ProductRangesComponent } from './components/Masters/product-ranges/product-ranges.component';
import { ProductComponent } from './components/Masters/product/product.component';
import { VariantComponent } from './components/Masters/variant/variant.component';
import { VideoplayerComponent } from './components/shared/services/videoplayer/videoplayer.component';
import { MediaComponentComponent } from './components/Masters/media/media-component/media-component.component';
import { PartnerMediaComponent } from './components/Masters/media/partner-media/partner-media.component';
import { MediaDetailsComponent } from './components/Masters/media/media-details/media-details.component';
import { CategoryTypeComponent } from './components/Masters/Category/category-type/category-type.component';
import { GoemComponent } from './components/Masters/goem/goem.component';
import { KgdComponent } from './components/Masters/kgd/kgd.component';
import { RestrictedComponent } from './components/unauthorized/restricted/restricted.component';
import { roleGuard } from './helpers/guards/role.guard';
import { Component } from '@angular/core';
import { HomeComponent } from './components/features/home/home.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { HomeViewComponent } from './components/features/home-view/home-view.component';
import { ContentManagerApprovalComponent } from './components/Masters/media/content-manager-approval/content-manager-approval.component';
import { CategoriesComponent } from './components/features/categories/categories.component';
import { AllRangeComponent } from './components/features/all-range/all-range.component';
import { ViewCatalougesComponent } from './components/features/view-catalouges/view-catalouges.component';
import { ViewPresentationsComponent } from './components/features/view-presentations/view-presentations.component';
import { ViewVideosComponent } from './components/features/view-videos/view-videos.component';
import { LeadGenerationComponent } from './components/features/lead-generation/lead-generation.component';
import { ProfileComponent } from './components/features/profile/profile.component';
import { MyAccountComponent } from './components/features/my-account/my-account.component';
import { LeadsProfileComponent } from './components/features/leads-profile/leads-profile.component';


export const routes: Routes = [

  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },

  {
    path: '',
    component: MainLayoutComponent,

    children: [

      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'user-roles',
        component: UserRolesComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'add-user',
        component: AddUserComponent,
        canActivate: [roleGuard,],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'org',
        component: OrgManagementComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }

      },

      {
        path: 'role-management',
        component: RoleManagementComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' },
      },
      {
        path: 'banner',
        component: BannerComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'category',
        component: AddCategoryComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'fuel',
        component: AddFuelComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'product-ranges',
        component: ProductRangesComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'products',
        component: ProductComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'variant',
        component: VariantComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'video',
        component: VideoplayerComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'media',
        component: MediaComponentComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'partner-Media',
        component: PartnerMediaComponent,
        canActivate: [roleGuard],
          // data: { role_name: ['!Super Admin'], org_name: 'KOEL' }

        data: { role_name: ['ZSM'], org_name: 'KOEL' }
      },

      {
        path: 'approval',
        component: MediaDetailsComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
        //  data: { role_name: ['Super Admin','Owner'], org_name: 'C.S.S. Vennal Naidu & Sons Pvt. Ltd' }
      },
      {
        path: 'category-type',
        component: CategoryTypeComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'goem',
        component: GoemComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'kgd',
        component: KgdComponent,
        canActivate: [roleGuard],
        data: { role_name: ['Super Admin'], org_name: 'KOEL' }
      },
      {
        path: 'home',
        component: HomeComponent,
        children: [
          {
            path: '',
            component: HomeViewComponent
          },
          {
            path: 'categories',
            loadComponent: () =>
              import('./components/features/categories/categories.component').then(
                m => m.CategoriesComponent
              )
          },
          {
            path: 'all-range',
            loadComponent: () =>
              import('./components/features/all-range/all-range.component').then(
                m => m.AllRangeComponent
              )
          },
          {
            path: 'catalogues',
            loadComponent: () =>
              import('./components/features/view-catalouges/view-catalouges.component').then(
                m => m.ViewCatalougesComponent
              )
          },
          {
            path: 'presentations',
            loadComponent: () =>
              import('./components/features/view-presentations/view-presentations.component').then(
                m => m.ViewPresentationsComponent
              )
          },
          // {
          //   path:'partner-media',
          //   loadComponent:()=>
          //     import('./components/Masters/media/partner-media/partner-media.component').then(
          //       m=>m.PartnerMediaComponent
          //     )
          // },
          {
            path: 'videos',
            loadComponent: () =>
              import('./components/features/view-videos/view-videos.component').then(
                m => m.ViewVideosComponent
              )
          },
          {
            path: 'Lead-Gen',
            loadComponent: () =>
              import('./components/features/lead-generation/lead-generation.component').then(
                m => m.LeadGenerationComponent
              )
          },
          {
            path: 'profile',
            loadComponent: () => import('./components/features/profile/profile.component').then(m => m.ProfileComponent)
          },

          {
            path: 'my-Account',
            loadComponent: () => import('./components/features/my-account/my-account.component').then(m => m.MyAccountComponent)
          },

          {
            path: 'notifications',
            loadComponent: () => import('./components/features/notifications/notifications.component').then(m => m.NotificationsComponent)
          },
          {
            path: 'product-Details',
            loadComponent: () => import('./components/features/product-details/product-details.component').then(m => m.ProductDetailsComponent)
          },
          {
            path: 'std-genset/:catId',
            loadComponent: () => import('./components/features/standard-genset/standard-genset.component').then(m => m.StandardGensetComponent)
          },
          {
            path: 'my-leads',
            loadComponent: () =>
              import('./components/features/leads-profile/leads-profile.component').then(
                (m) => m.LeadsProfileComponent
              )
          },
          {
            path: 'kgd-data',
            loadComponent: () =>
              import('./components/features/kgd-data/kgd-data.component').then(
                (m) => m.KgdDataComponent
              )
          },
            {
            path: 'kgd-details',
            loadComponent: () =>
              import('./components/features/filtered-kgds/filtered-kgds.component').then(
                (m) => m.FilteredKgdsComponent
              )
          },

          // {
          //   path: 'adv-genset',
          //   loadComponent: () => import('./components/features/adv-manufactured-genset/adv-manufactured-genset.component').then(m => m.AdvManufacturedGensetComponent)
          // },
          {
            path: 'customer-ref',
            loadComponent: () => import('./components/features/cust-reference/cust-reference.component').then(m => m.CustReferenceComponent)
          },
        ]
      },

      {
        path: 'unauthorized',
        component: RestrictedComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path: 'home-view',
        component: HomeViewComponent
      },
      {
        path: 'manager-approval',
        component: ContentManagerApprovalComponent,
        data: { role_name: ['Content Manager'], org_name: 'KOEL' }
      }



    ]
  },




];
