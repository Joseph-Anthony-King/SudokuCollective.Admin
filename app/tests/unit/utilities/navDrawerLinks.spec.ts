import { describe, expect, it } from 'vitest';
import { NavDrawerLinks } from '@/utilities/links/navDrawerLinks';
import { MenuItem } from '@/models/infrastructure/menuItem';

describe('The NavDrawerLinks utility', () => {
  it('should export an array of MenuItem objects', () => {
    // Assert
    expect(Array.isArray(NavDrawerLinks)).toBe(true);
    expect(NavDrawerLinks.length).toBe(4);
    NavDrawerLinks.forEach(item => {
      expect(item instanceof MenuItem).toBe(true);
    });
  });

  it('should have correct Home link', () => {
    // Assert
    const homeLink = NavDrawerLinks[0];
    expect(homeLink.url).toBe('/');
    expect(homeLink.title).toBe('Home');
    expect(homeLink.tooltip).toBe('Go to Home');
    expect(homeLink.mdiIcon).toBe('mdi-home-outline');
    expect(homeLink.target).toBe('_blank');
    expect(homeLink.condition).toBe(true);
  });

  it('should have correct Dashboard link', () => {
    // Assert
    const dashboardLink = NavDrawerLinks[1];
    expect(dashboardLink.url).toBe('/dashboard');
    expect(dashboardLink.title).toBe('Dashboard');
    expect(dashboardLink.tooltip).toBe('Go to Dashboard');
    expect(dashboardLink.mdiIcon).toBe('mdi-view-dashboard-variant-outline');
    expect(dashboardLink.target).toBe('_blank');
    expect(dashboardLink.condition).toBe(true);
  });

  it('should have correct Site Administration link', () => {
    // Assert
    const siteAdminLink = NavDrawerLinks[2];
    expect(siteAdminLink.url).toBe('/site-admin');
    expect(siteAdminLink.title).toBe('Site Administration');
    expect(siteAdminLink.tooltip).toBe('Go to Site Administration');
    expect(siteAdminLink.mdiIcon).toBe('mdi-layers-outline');
    expect(siteAdminLink.target).toBe('_blank');
    expect(siteAdminLink.condition).toBe(false);
  });

  it('should have correct User Profile link', () => {
    // Assert
    const userProfileLink = NavDrawerLinks[3];
    expect(userProfileLink.url).toBe('/user-profile');
    expect(userProfileLink.title).toBe('User Profile');
    expect(userProfileLink.tooltip).toBe('Go to User Profile');
    expect(userProfileLink.mdiIcon).toBe('mdi-account');
    expect(userProfileLink.target).toBe('_blank');
    expect(userProfileLink.condition).toBe(true);
  });

  it('should have all links open in a new tab', () => {
    // Assert
    NavDrawerLinks.forEach(link => {
      expect(link.target).toBe('_blank');
    });
  });

  it('should have specific condition values for each link', () => {
    // Assert
    expect(NavDrawerLinks[0].condition).toBe(true);
    expect(NavDrawerLinks[1].condition).toBe(true);
    expect(NavDrawerLinks[2].condition).toBe(false); // Site Administration is conditional
    expect(NavDrawerLinks[3].condition).toBe(true);
  });

  it('should have exactly one link with condition set to false', () => {
    // Arrange
    const falseConditionLinks = NavDrawerLinks.filter(link => link.condition === false);
    
    // Assert
    expect(falseConditionLinks.length).toBe(1);
    expect(falseConditionLinks[0].title).toBe('Site Administration');
  });

  it('should maintain correct order of links', () => {
    // Assert
    expect(NavDrawerLinks[0].title).toBe('Home');
    expect(NavDrawerLinks[1].title).toBe('Dashboard');
    expect(NavDrawerLinks[2].title).toBe('Site Administration');
    expect(NavDrawerLinks[3].title).toBe('User Profile');
  });

  it('should properly construct MenuItem instances', () => {
    // Arrange
    const expectedHomeMenuItem = new MenuItem(
      '/',
      'Home',
      'Go to Home',
      'mdi-home-outline',
      '_blank',
      true
    );
    
    // Assert - testing first item as an example
    expect(NavDrawerLinks[0]).toEqual(expectedHomeMenuItem);
  });
});
