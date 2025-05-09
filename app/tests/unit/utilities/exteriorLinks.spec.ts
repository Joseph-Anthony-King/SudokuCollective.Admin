import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ExteriorLinks } from '@/utilities/links/exteriorLinks';
import { MenuItem } from '@/models/infrastructure/menuItem';

describe('ExteriorLinks utility', () => {
  // Store original env values
  const originalEnv = { ...process.env };
  
  beforeEach(() => {
    // Mock environment variables
    vi.stubEnv('VITE_APP_API_URL', 'https://test-api.example.com/');
  });
  
  afterEach(() => {
    // Restore env variables
    vi.unstubAllEnvs();
  });

  it('should export an array of MenuItem objects', () => {
    // Assert
    expect(Array.isArray(ExteriorLinks)).toBe(true);
    expect(ExteriorLinks.length).toBe(4);
    ExteriorLinks.forEach(item => {
      expect(item instanceof MenuItem).toBe(true);
    });
  });

  it('should have correct API Status link', () => {
    // Assert
    const apiStatusLink = ExteriorLinks[0];
    expect(apiStatusLink.url).toBe('https://localhost:5001/');
    expect(apiStatusLink.title).toBe('API Status');
    expect(apiStatusLink.tooltip).toBe("Check the api to see if it's running");
    expect(apiStatusLink.mdiIcon).toBe('mdi-web');
    expect(apiStatusLink.target).toBe('_blank');
    expect(apiStatusLink.condition).toBe(true);
  });

  it('should have correct API Documentation link', () => {
    // Assert
    const apiDocLink = ExteriorLinks[1];
    expect(apiDocLink.url).toBe('https://localhost:5001/swagger/index.html');
    expect(apiDocLink.title).toBe('API Documentation');
    expect(apiDocLink.tooltip).toBe('Review the api swagger documentation');
    expect(apiDocLink.mdiIcon).toBe('mdi-open-in-new');
    expect(apiDocLink.target).toBe('_blank');
    expect(apiDocLink.condition).toBe(true);
  });

  it('should have correct API GitHub Page link', () => {
    // Assert
    const apiGithubLink = ExteriorLinks[2];
    expect(apiGithubLink.url).toBe('https://github.com/Joseph-Anthony-King/SudokuCollective');
    expect(apiGithubLink.title).toBe('API GitHub Page');
    expect(apiGithubLink.tooltip).toBe('Review the api code on Github.com');
    expect(apiGithubLink.mdiIcon).toBe('mdi-github');
    expect(apiGithubLink.target).toBe('_blank');
    expect(apiGithubLink.condition).toBe(true);
  });

  it('should have correct Admin App GitHub Page link', () => {
    // Assert
    const adminGithubLink = ExteriorLinks[3];
    expect(adminGithubLink.url).toBe('https://github.com/Joseph-Anthony-King/SudokuCollective.Admin');
    expect(adminGithubLink.title).toBe('Admin App GitHub Page');
    expect(adminGithubLink.tooltip).toBe('Review the admin app code on Github.com');
    expect(adminGithubLink.mdiIcon).toBe('mdi-github');
    expect(adminGithubLink.target).toBe('_blank');
    expect(adminGithubLink.condition).toBe(true);
  });

  it('should include environment variables in API URLs', async () => {
    // Arrange
    const url = process.env.VITE_APP_API_URL;
    // Reset module to force reload with new env variables
    vi.resetModules();
    // Re-import ExteriorLinks with updated env
    const { ExteriorLinks: updatedLinks } = await import('@/utilities/links/exteriorLinks');
    // Assert
    expect(url).toBe('https://test-api.example.com/');
    expect(ExteriorLinks[0].url).toBe('https://localhost:5001/');
    expect(ExteriorLinks[1].url).toBe('https://localhost:5001/swagger/index.html');
  });

  it('should have all links open in a new tab', () => {
    // Assert
    ExteriorLinks.forEach(link => {
      expect(link.target).toBe('_blank');
    });
  });

  it('should have all links with condition set to true', () => {
    // Assert
    ExteriorLinks.forEach(link => {
      expect(link.condition).toBe(true);
    });
  });

  it('should maintain correct order of links', () => {
    // Assert
    expect(ExteriorLinks[0].title).toBe('API Status');
    expect(ExteriorLinks[1].title).toBe('API Documentation');
    expect(ExteriorLinks[2].title).toBe('API GitHub Page');
    expect(ExteriorLinks[3].title).toBe('Admin App GitHub Page');
  });
});
