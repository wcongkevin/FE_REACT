import { FileUpload } from './file-upload';

describe('FileUpload', () => {
  it('should create an instance of FileUpload', () => {
    const testName = 'example.txt';
    const testSize = '15KB';
    const testDate = new Date();

    const fileUpload = new FileUpload(testName, testSize, testDate);

    expect(fileUpload).toBeInstanceOf(FileUpload);
    expect(fileUpload.name).toBe(testName);
    expect(fileUpload.size).toBe(testSize);
    expect(fileUpload.lastModifiedDate).toBe(testDate);
  });

  it('should have correct property types', () => {
    const testName = 'example.txt';
    const testSize = '15KB';
    const testDate = new Date();

    const fileUpload = new FileUpload(testName, testSize, testDate);

    expect(typeof fileUpload.name).toBe('string');
    expect(typeof fileUpload.size).toBe('string');
    expect(fileUpload.lastModifiedDate).toBeInstanceOf(Date);
  });

  it('should handle empty string and null values', () => {
    const fileUpload = new FileUpload('', '', null);

    expect(fileUpload.name).toBe('');
    expect(fileUpload.size).toBe('');
    expect(fileUpload.lastModifiedDate).toBeNull();
  });
});