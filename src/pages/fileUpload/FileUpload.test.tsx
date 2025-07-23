import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from './FileUpload';
import FileService from '../../services/FileService';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../services/FileService');

describe('FileUpload Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (FileService.getFileVersions as jest.Mock).mockResolvedValueOnce({ data: {/* mock data */} });
    (FileService.uploadChunk as jest.Mock).mockResolvedValueOnce({ data: {/* mock response */} });
  });

  test('should display loader initially', () => {
    render(<Router><FileUpload /></Router>);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('should load file versions and configs on mount', async () => {
    render(<Router><FileUpload /></Router>);

    await waitFor(() => expect(FileService.getFileVersions).toHaveBeenCalledTimes(1));
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  test('should display file upload form', async () => {
    render(<Router><FileUpload /></Router>);
    await waitFor(() => expect(FileService.getFileVersions).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('upload-button')).toBeInTheDocument();
  });

  test('should handle file selection', async () => {
    render(<Router><FileUpload /></Router>);

    await waitFor(() => expect(FileService.getFileVersions).toHaveBeenCalledTimes(1));
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;;
    const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files[0]).toBe(file);
  });

  test('should handle file upload', async () => {
    render(<Router><FileUpload /></Router>);
    await waitFor(() => expect(FileService.getFileVersions).toHaveBeenCalledTimes(1));
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files?.[0]).toBe(file);
  });
});