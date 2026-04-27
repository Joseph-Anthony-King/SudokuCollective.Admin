import { describe, it, expect } from 'vitest';
import type { ICreateAppLicenseRequestData } from '@/interfaces/requests/iCreateAppLicenseRequestData';

describe('ICreateAppLicenseRequestData interface', () => {
  describe('Required Properties', () => {
    it('should create a valid object with all required properties', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test App',
        ownerId: 123,
      };

      expect(data.name).toBe('Test App');
      expect(data.ownerId).toBe(123);
    });

    it('should require name property', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'My Application',
        ownerId: 1,
      };

      expect(data).toHaveProperty('name');
      expect(typeof data.name).toBe('string');
    });

    it('should require ownerId property', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'My Application',
        ownerId: 456,
      };

      expect(data).toHaveProperty('ownerId');
      expect(typeof data.ownerId).toBe('number');
    });

    it('should accept empty string for name', () => {
      const data: ICreateAppLicenseRequestData = {
        name: '',
        ownerId: 1,
      };

      expect(data.name).toBe('');
    });

    it('should accept zero for ownerId', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test',
        ownerId: 0,
      };

      expect(data.ownerId).toBe(0);
    });

    it('should accept negative number for ownerId', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test',
        ownerId: -1,
      };

      expect(data.ownerId).toBe(-1);
    });

    it('should accept very large ownerId', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test',
        ownerId: Number.MAX_SAFE_INTEGER,
      };

      expect(data.ownerId).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should accept special characters in name', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test!@#$%^&*()_+-={}[]|:;"<>?,./',
        ownerId: 1,
      };

      expect(data.name).toBe('Test!@#$%^&*()_+-={}[]|:;"<>?,./');
    });

    it('should accept unicode characters in name', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test 测试 🚀',
        ownerId: 1,
      };

      expect(data.name).toBe('Test 测试 🚀');
    });

    it('should accept very long name', () => {
      const longName = 'A'.repeat(1000);
      const data: ICreateAppLicenseRequestData = {
        name: longName,
        ownerId: 1,
      };

      expect(data.name).toBe(longName);
      expect(data.name.length).toBe(1000);
    });
  });

  describe('Optional Properties', () => {
    it('should create valid object without optional properties', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Minimal App',
        ownerId: 789,
      };

      expect(data.localUrl).toBeUndefined();
      expect(data.testUrl).toBeUndefined();
      expect(data.stagingUrl).toBeUndefined();
      expect(data.prodUrl).toBeUndefined();
      expect(data.sourceCodeUrl).toBeUndefined();
    });

    it('should accept localUrl as optional property', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test App',
        ownerId: 1,
        localUrl: 'http://localhost:3000',
      };

      expect(data.localUrl).toBe('http://localhost:3000');
    });

    it('should accept testUrl as optional property', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test App',
        ownerId: 1,
        testUrl: 'http://test.example.com',
      };

      expect(data.testUrl).toBe('http://test.example.com');
    });

    it('should accept stagingUrl as optional property', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test App',
        ownerId: 1,
        stagingUrl: 'http://staging.example.com',
      };

      expect(data.stagingUrl).toBe('http://staging.example.com');
    });

    it('should accept prodUrl as optional property', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test App',
        ownerId: 1,
        prodUrl: 'http://prod.example.com',
      };

      expect(data.prodUrl).toBe('http://prod.example.com');
    });

    it('should accept sourceCodeUrl as optional property', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test App',
        ownerId: 1,
        sourceCodeUrl: 'https://github.com/user/repo',
      };

      expect(data.sourceCodeUrl).toBe('https://github.com/user/repo');
    });

    it('should accept empty string for optional URL properties', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test App',
        ownerId: 1,
        localUrl: '',
        testUrl: '',
        stagingUrl: '',
        prodUrl: '',
        sourceCodeUrl: '',
      };

      expect(data.localUrl).toBe('');
      expect(data.testUrl).toBe('');
      expect(data.stagingUrl).toBe('');
      expect(data.prodUrl).toBe('');
      expect(data.sourceCodeUrl).toBe('');
    });

    it('should accept undefined for optional URL properties', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test App',
        ownerId: 1,
        localUrl: undefined,
        testUrl: undefined,
        stagingUrl: undefined,
        prodUrl: undefined,
        sourceCodeUrl: undefined,
      };

      expect(data.localUrl).toBeUndefined();
      expect(data.testUrl).toBeUndefined();
      expect(data.stagingUrl).toBeUndefined();
      expect(data.prodUrl).toBeUndefined();
      expect(data.sourceCodeUrl).toBeUndefined();
    });
  });

  describe('Complete Object Creation', () => {
    it('should create object with all properties defined', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Complete Application',
        ownerId: 999,
        localUrl: 'http://localhost:5000',
        testUrl: 'http://test.myapp.com',
        stagingUrl: 'http://staging.myapp.com',
        prodUrl: 'https://www.myapp.com',
        sourceCodeUrl: 'https://github.com/company/myapp',
      };

      expect(data.name).toBe('Complete Application');
      expect(data.ownerId).toBe(999);
      expect(data.localUrl).toBe('http://localhost:5000');
      expect(data.testUrl).toBe('http://test.myapp.com');
      expect(data.stagingUrl).toBe('http://staging.myapp.com');
      expect(data.prodUrl).toBe('https://www.myapp.com');
      expect(data.sourceCodeUrl).toBe('https://github.com/company/myapp');
    });

    it('should create object with mixed defined and undefined properties', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Mixed App',
        ownerId: 42,
        localUrl: 'http://localhost:8080',
        testUrl: undefined,
        stagingUrl: 'http://staging.example.com',
        prodUrl: undefined,
        sourceCodeUrl: 'https://gitlab.com/user/project',
      };

      expect(data.name).toBe('Mixed App');
      expect(data.ownerId).toBe(42);
      expect(data.localUrl).toBe('http://localhost:8080');
      expect(data.testUrl).toBeUndefined();
      expect(data.stagingUrl).toBe('http://staging.example.com');
      expect(data.prodUrl).toBeUndefined();
      expect(data.sourceCodeUrl).toBe('https://gitlab.com/user/project');
    });
  });

  describe('URL Format Variations', () => {
    it('should accept HTTP URLs', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'HTTP App',
        ownerId: 1,
        localUrl: 'http://example.com',
      };

      expect(data.localUrl).toBe('http://example.com');
    });

    it('should accept HTTPS URLs', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'HTTPS App',
        ownerId: 1,
        prodUrl: 'https://secure.example.com',
      };

      expect(data.prodUrl).toBe('https://secure.example.com');
    });

    it('should accept URLs with ports', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Port App',
        ownerId: 1,
        localUrl: 'http://localhost:3000',
        testUrl: 'http://test.example.com:8080',
      };

      expect(data.localUrl).toBe('http://localhost:3000');
      expect(data.testUrl).toBe('http://test.example.com:8080');
    });

    it('should accept URLs with paths', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Path App',
        ownerId: 1,
        prodUrl: 'https://example.com/app/path',
      };

      expect(data.prodUrl).toBe('https://example.com/app/path');
    });

    it('should accept URLs with query parameters', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Query App',
        ownerId: 1,
        testUrl: 'http://test.example.com?param1=value1&param2=value2',
      };

      expect(data.testUrl).toBe('http://test.example.com?param1=value1&param2=value2');
    });

    it('should accept URLs with fragments', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Fragment App',
        ownerId: 1,
        stagingUrl: 'http://staging.example.com#section',
      };

      expect(data.stagingUrl).toBe('http://staging.example.com#section');
    });

    it('should accept localhost URLs', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Localhost App',
        ownerId: 1,
        localUrl: 'http://localhost',
      };

      expect(data.localUrl).toBe('http://localhost');
    });

    it('should accept IP address URLs', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'IP App',
        ownerId: 1,
        localUrl: 'http://192.168.1.1:3000',
      };

      expect(data.localUrl).toBe('http://192.168.1.1:3000');
    });

    it('should accept subdomain URLs', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Subdomain App',
        ownerId: 1,
        prodUrl: 'https://api.subdomain.example.com',
      };

      expect(data.prodUrl).toBe('https://api.subdomain.example.com');
    });
  });

  describe('Edge Cases', () => {
    it('should handle object with only required properties set to minimum values', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'A',
        ownerId: 1,
      };

      expect(data.name).toBe('A');
      expect(data.ownerId).toBe(1);
    });

    it('should handle whitespace in name', () => {
      const data: ICreateAppLicenseRequestData = {
        name: '   Whitespace App   ',
        ownerId: 1,
      };

      expect(data.name).toBe('   Whitespace App   ');
    });

    it('should handle newlines in name', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Line 1\nLine 2\nLine 3',
        ownerId: 1,
      };

      expect(data.name).toBe('Line 1\nLine 2\nLine 3');
    });

    it('should handle tabs in name', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Tab\tSeparated\tName',
        ownerId: 1,
      };

      expect(data.name).toBe('Tab\tSeparated\tName');
    });

    it('should create multiple independent objects', () => {
      const data1: ICreateAppLicenseRequestData = {
        name: 'App 1',
        ownerId: 1,
      };

      const data2: ICreateAppLicenseRequestData = {
        name: 'App 2',
        ownerId: 2,
      };

      expect(data1.name).toBe('App 1');
      expect(data2.name).toBe('App 2');
      expect(data1).not.toBe(data2);
    });

    it('should support object spreading', () => {
      const baseData: ICreateAppLicenseRequestData = {
        name: 'Base App',
        ownerId: 1,
      };

      const extendedData: ICreateAppLicenseRequestData = {
        ...baseData,
        localUrl: 'http://localhost:3000',
      };

      expect(extendedData.name).toBe('Base App');
      expect(extendedData.ownerId).toBe(1);
      expect(extendedData.localUrl).toBe('http://localhost:3000');
    });

    it('should support object spreading with overrides', () => {
      const baseData: ICreateAppLicenseRequestData = {
        name: 'Base App',
        ownerId: 1,
        localUrl: 'http://localhost:3000',
      };

      const overriddenData: ICreateAppLicenseRequestData = {
        ...baseData,
        name: 'Overridden App',
        localUrl: 'http://localhost:8080',
      };

      expect(overriddenData.name).toBe('Overridden App');
      expect(overriddenData.ownerId).toBe(1);
      expect(overriddenData.localUrl).toBe('http://localhost:8080');
    });

    it('should support partial updates via spreading', () => {
      const originalData: ICreateAppLicenseRequestData = {
        name: 'Original',
        ownerId: 1,
        localUrl: 'http://localhost:3000',
        testUrl: 'http://test.example.com',
      };

      const updatedData: ICreateAppLicenseRequestData = {
        ...originalData,
        testUrl: 'http://new-test.example.com',
      };

      expect(updatedData.name).toBe('Original');
      expect(updatedData.ownerId).toBe(1);
      expect(updatedData.localUrl).toBe('http://localhost:3000');
      expect(updatedData.testUrl).toBe('http://new-test.example.com');
    });
  });

  describe('Object Manipulation', () => {
    it('should support Object.keys', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test',
        ownerId: 1,
        localUrl: 'http://localhost',
      };

      const keys = Object.keys(data);
      expect(keys).toContain('name');
      expect(keys).toContain('ownerId');
      expect(keys).toContain('localUrl');
    });

    it('should support Object.values', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test',
        ownerId: 123,
      };

      const values = Object.values(data);
      expect(values).toContain('Test');
      expect(values).toContain(123);
    });

    it('should support Object.entries', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Test',
        ownerId: 456,
      };

      const entries = Object.entries(data);
      expect(entries).toContainEqual(['name', 'Test']);
      expect(entries).toContainEqual(['ownerId', 456]);
    });

    it('should support JSON.stringify', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'JSON Test',
        ownerId: 789,
        localUrl: 'http://localhost:3000',
      };

      const json = JSON.stringify(data);
      expect(json).toContain('"name":"JSON Test"');
      expect(json).toContain('"ownerId":789');
      expect(json).toContain('"localUrl":"http://localhost:3000"');
    });

    it('should support JSON.parse', () => {
      const json = '{"name":"Parsed App","ownerId":111,"prodUrl":"https://example.com"}';
      const data: ICreateAppLicenseRequestData = JSON.parse(json);

      expect(data.name).toBe('Parsed App');
      expect(data.ownerId).toBe(111);
      expect(data.prodUrl).toBe('https://example.com');
    });

    it('should support destructuring', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Destructured App',
        ownerId: 222,
        localUrl: 'http://localhost',
      };

      const { name, ownerId, localUrl } = data;

      expect(name).toBe('Destructured App');
      expect(ownerId).toBe(222);
      expect(localUrl).toBe('http://localhost');
    });

    it('should support destructuring with defaults', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Default Test',
        ownerId: 333,
      };

      const {
        name,
        ownerId,
        localUrl = 'http://default-local',
        testUrl = 'http://default-test',
      } = data;

      expect(name).toBe('Default Test');
      expect(ownerId).toBe(333);
      expect(localUrl).toBe('http://default-local');
      expect(testUrl).toBe('http://default-test');
    });
  });

  describe('Type Safety', () => {
    it('should ensure name is a string type', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Type Test',
        ownerId: 1,
      };

      expect(typeof data.name).toBe('string');
    });

    it('should ensure ownerId is a number type', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Type Test',
        ownerId: 999,
      };

      expect(typeof data.ownerId).toBe('number');
    });

    it('should ensure optional URLs are string or undefined', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Type Test',
        ownerId: 1,
        localUrl: 'http://localhost',
        testUrl: undefined,
      };

      expect(typeof data.localUrl).toBe('string');
      expect(data.testUrl).toBeUndefined();
    });

    it('should work with type guards', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Guard Test',
        ownerId: 1,
        localUrl: 'http://localhost',
      };

      const hasLocalUrl = (obj: ICreateAppLicenseRequestData): obj is ICreateAppLicenseRequestData & { localUrl: string } => {
        return obj.localUrl !== undefined;
      };

      expect(hasLocalUrl(data)).toBe(true);
    });
  });

  describe('Array Operations', () => {
    it('should support arrays of ICreateAppLicenseRequestData', () => {
      const dataArray: ICreateAppLicenseRequestData[] = [
        { name: 'App 1', ownerId: 1 },
        { name: 'App 2', ownerId: 2 },
        { name: 'App 3', ownerId: 3 },
      ];

      expect(dataArray.length).toBe(3);
      expect(dataArray[0].name).toBe('App 1');
      expect(dataArray[1].ownerId).toBe(2);
      expect(dataArray[2].name).toBe('App 3');
    });

    it('should support mapping over arrays', () => {
      const dataArray: ICreateAppLicenseRequestData[] = [
        { name: 'App 1', ownerId: 1 },
        { name: 'App 2', ownerId: 2 },
      ];

      const names = dataArray.map(d => d.name);
      expect(names).toEqual(['App 1', 'App 2']);
    });

    it('should support filtering arrays', () => {
      const dataArray: ICreateAppLicenseRequestData[] = [
        { name: 'App 1', ownerId: 1, localUrl: 'http://localhost' },
        { name: 'App 2', ownerId: 2 },
        { name: 'App 3', ownerId: 3, localUrl: 'http://localhost' },
      ];

      const withLocalUrl = dataArray.filter(d => d.localUrl !== undefined);
      expect(withLocalUrl.length).toBe(2);
    });

    it('should support finding in arrays', () => {
      const dataArray: ICreateAppLicenseRequestData[] = [
        { name: 'App 1', ownerId: 1 },
        { name: 'App 2', ownerId: 2 },
        { name: 'App 3', ownerId: 3 },
      ];

      const found = dataArray.find(d => d.ownerId === 2);
      expect(found).toBeDefined();
      expect(found?.name).toBe('App 2');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle typical production app creation', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Production App',
        ownerId: 1001,
        localUrl: 'http://localhost:3000',
        testUrl: 'https://test-app.example.com',
        stagingUrl: 'https://staging-app.example.com',
        prodUrl: 'https://app.example.com',
        sourceCodeUrl: 'https://github.com/company/production-app',
      };

      expect(data).toMatchObject({
        name: 'Production App',
        ownerId: 1001,
        localUrl: 'http://localhost:3000',
        testUrl: 'https://test-app.example.com',
        stagingUrl: 'https://staging-app.example.com',
        prodUrl: 'https://app.example.com',
        sourceCodeUrl: 'https://github.com/company/production-app',
      });
    });

    it('should handle minimal dev-only app creation', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Dev App',
        ownerId: 5,
        localUrl: 'http://localhost:8080',
      };

      expect(data.name).toBe('Dev App');
      expect(data.ownerId).toBe(5);
      expect(data.localUrl).toBe('http://localhost:8080');
      expect(data.testUrl).toBeUndefined();
      expect(data.stagingUrl).toBeUndefined();
      expect(data.prodUrl).toBeUndefined();
      expect(data.sourceCodeUrl).toBeUndefined();
    });

    it('should handle app creation with only production URL', () => {
      const data: ICreateAppLicenseRequestData = {
        name: 'Prod Only App',
        ownerId: 10,
        prodUrl: 'https://live-app.example.com',
      };

      expect(data.name).toBe('Prod Only App');
      expect(data.prodUrl).toBe('https://live-app.example.com');
      expect(data.localUrl).toBeUndefined();
      expect(data.testUrl).toBeUndefined();
      expect(data.stagingUrl).toBeUndefined();
    });
  });
});
