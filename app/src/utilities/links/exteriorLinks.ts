import { MenuItem } from '@/models/infrastructure/menuItem';

export const ExteriorLinks: Array<MenuItem> = [
  new MenuItem(
    `${process.env.VITE_APP_API_URL}`,
    'API Status',
    "Check the api to see if it's running",
    'mdi-web',
    '_blank',
    true,
  ),
  new MenuItem(
    `${process.env.VITE_APP_API_URL}swagger/index.html`,
    'API Documentation',
    'Review the api swagger documentation',
    'mdi-open-in-new',
    '_blank',
    true,
  ),
  new MenuItem(
    'https://github.com/Joseph-Anthony-King/SudokuCollective',
    'API GitHub Page',
    'Review the api code on Github.com',
    'mdi-github',
    '_blank',
    true,
  ),
  new MenuItem(
    'https://github.com/Joseph-Anthony-King/SudokuCollective.Admin',
    'Admin App GitHub Page',
    'Review the admin app code on Github.com',
    'mdi-github',
    '_blank',
    true,
  ),
];
