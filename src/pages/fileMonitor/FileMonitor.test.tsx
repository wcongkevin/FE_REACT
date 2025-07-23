import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import FileMonitor from './FileMonitor';

// Mock the MonitoringService to prevent actual API calls during tests
jest.mock('../../services/MonitoringService', () => ({
  getMonitoringDataById: jest.fn().mockResolvedValue({
    data: [
      { Market: 'Market1', Retailer: 'Retailer1', Division: 'Division1', UploadDate: '2022-01-01', IncidentNo: '123', Status: 'Active' }
    ]
  }),
  getDataById: jest.fn().mockResolvedValue({
    data: {
      division: ['Division1', 'Division2'],
      retailer: ['Retailer1', 'Retailer2'],
      market: ['Market1', 'Market2']
    }
  }),
  postMonitoringDataById: jest.fn().mockResolvedValue({
    data: [
      { Market: 'Market1', Retailer: 'Retailer1', Division: 'Division1', UploadDate: '2022-01-01', IncidentNo: '123', Status: 'Active' }
    ]
  })
}));

test('renders FileMonitor component', async () => {
  render(<FileMonitor />);
  expect(screen.getByTestId('fileMonitor')).toBeInTheDocument();
  expect(screen.getByTestId('market')).toBeInTheDocument();
  expect(screen.getByTestId('retailer')).toBeInTheDocument();
  expect(screen.getByTestId('division')).toBeInTheDocument();
});

test('search functionality works', async () => {
  render(<FileMonitor />);
  await waitFor(() => {
    expect(screen.getByText(/File Monitor/i)).toBeInTheDocument();
  });
  const searchInput = screen.getByPlaceholderText('Search');
  fireEvent.change(searchInput, { target: { value: '123' } });

  expect(screen.getByDisplayValue('123')).toBeInTheDocument();
});

test('date picker functionality', async () => {
  render(<FileMonitor />);
  await waitFor(() => {
    expect(screen.getByText(/File Monitor/i)).toBeInTheDocument();
  });
  const startDateButton = screen.getByTestId('startDate');
  fireEvent.click(startDateButton);
});

test('reset functionality works', async () => {
  render(<FileMonitor />);

  await waitFor(() => {
    expect(screen.getByText(/File Monitor/i)).toBeInTheDocument();
  });

  const searchInput = screen.getByPlaceholderText('Search');
  fireEvent.click(searchInput, { target: { value: 'Test Search' } });
  expect(screen.getByDisplayValue('Test Search')).toBeInTheDocument();
});
