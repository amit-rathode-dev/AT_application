// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';
  
// export const roleGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const user = JSON.parse(localStorage.getItem('userDetails') || 'null');
  
//   const allowedRoles = route.data?.['role_name'] as string[] | undefined;
//   // const allowedOrg = route.data?.['org_name'] as string | undefined;
//   const allowedOrgType=route.data?.['org_type'] as string | undefined;
  
//   const userRole = user?.role_name;
//   // const userOrg = user?.org_name;
//   const orgType=user?.org_type;
  
  

//   const isNegatedOrg = allowedOrgType?.startsWith('!');
//   const expectedOrg = allowedOrgType?.replace('!', '');

//   // const isOrgMatch = isNegatedOrg
//   //   ? userOrg?.toLowerCase() !== expectedOrg?.toLowerCase()
//   //   : userOrg?.toLowerCase() === expectedOrg?.toLowerCase();
//     const isOrgTypeMatch = isNegatedOrg
//     ? orgType?.toLowerCase() !== expectedOrg?.toLowerCase()
//     : orgType?.toLowerCase() === expectedOrg?.toLowerCase();

//   const isRoleMatch = allowedRoles?.includes(userRole);

//   if (isRoleMatch && isOrgTypeMatch) {
//     return true;
//   }
  

//   router.navigate(['/unauthorized']);
//   return false;

// };




import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { EncryptionService } from '../../services/encryption.service';  // adjust path

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const encryptionService = inject(EncryptionService);

  const encryptedUser = localStorage.getItem('userDetails');
  const user = encryptedUser ? encryptionService.getItem('userDetails') : null;

  const allowedRoles = route.data?.['role_name'] as string[] | undefined;
  const allowedOrgType = route.data?.['org_type'] as string | undefined;

  const userRole = user?.role_name;
  const orgType = user?.org_type;

  const isNegatedOrg = allowedOrgType?.startsWith('!');
  const expectedOrg = allowedOrgType?.replace('!', '');

  const isOrgTypeMatch = isNegatedOrg
    ? orgType?.toLowerCase() !== expectedOrg?.toLowerCase()
    : orgType?.toLowerCase() === expectedOrg?.toLowerCase();

  const isRoleMatch = allowedRoles?.includes(userRole);

  if (isRoleMatch && isOrgTypeMatch) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
