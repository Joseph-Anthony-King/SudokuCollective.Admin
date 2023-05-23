import { MenuItem } from '@/models/infrastructure/menuItem';

export const NavDrawerLinks: Array<MenuItem> = [
  new MenuItem(
    `/`,
    'Home',
    "Go to Home",
    'mdi-home-outline',
    '_blank',
    true
  ),
  new MenuItem(
    `/dashboard`,
    'Dashboard',
    "Go to Dashboard",
    'mdi-view-dashboard-variant-outline',
    '_blank',
    true
  ),
  new MenuItem(
    `/site-admin`,
    'Site Admin',
    "Go to Site Administration",
    'mdi-layers-outline',
		'_blank',
		false
  ),
]