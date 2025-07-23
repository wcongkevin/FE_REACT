// Monitoring.test.js
import { Monitoring } from './monitoring';

describe('Monitoring', () => {
  beforeAll(() => {
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => 'test_user@example.com'),
        setItem: jest.fn(() => null),
        clear: jest.fn(() => null),
        removeItem: jest.fn(() => null)
      },
      writable: true
    });
  });

  it('should create an instance of Monitoring', () => {
    const monitoring = new Monitoring();

    expect(monitoring).toBeInstanceOf(Monitoring);
    expect(monitoring.user_id).toBe('test_user@example.com');
    expect(monitoring.market).toEqual([]);
    expect(monitoring.division).toEqual([]);
    expect(monitoring.retailer).toEqual([]);
    expect(monitoring.end_date).toBe('');
    expect(monitoring.start_date).toBe('');
  });

  it('should have correct default property values', () => {
    const monitoring = new Monitoring();

    expect(monitoring.market).toEqual([]);
    expect(monitoring.division).toEqual([]);
    expect(monitoring.retailer).toEqual([]);
    expect(monitoring.end_date).toBe('');
    expect(monitoring.start_date).toBe('');
  });

  it('should handle sessionStorage returning ""', () => {
    (sessionStorage.getItem as jest.Mock).mockReturnValueOnce('');
    const monitoring = new Monitoring();
    expect(monitoring.user_id).toBe('');
  });
});