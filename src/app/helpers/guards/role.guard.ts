import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
  
export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('userDetails') || 'null');
  
  const allowedRoles = route.data?.['role_name'] as string[] | undefined;
  const allowedOrg = route.data?.['org_name'] as string | undefined;
  
  const userRole = user?.role_name;
  const userOrg = user?.org_name;
  
  

  const isNegatedOrg = allowedOrg?.startsWith('!');
  const expectedOrg = allowedOrg?.replace('!', '');

  const isOrgMatch = isNegatedOrg
    ? userOrg?.toLowerCase() !== expectedOrg?.toLowerCase()
    : userOrg?.toLowerCase() === expectedOrg?.toLowerCase();

  const isRoleMatch = allowedRoles?.includes(userRole);

  if (isRoleMatch && isOrgMatch) {
    return true;
  }
  

  router.navigate(['/unauthorized']);
  return false;

};
