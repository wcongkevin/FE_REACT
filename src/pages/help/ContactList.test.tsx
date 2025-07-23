import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
import ContactList from './ContactList';
import HelpService from '../../services/HelpService';
import '@testing-library/jest-dom';

jest.mock('../../services/HelpService');

const mockDistributors = [
  { id: 1, name: 'Distributor One', email: 'one@example.com', market: 'Market One' },
  { id: 2, name: 'Distributor Two', email: 'two@example.com', market: 'Market Two' },
  // You can add more mock data here
];

describe('ContactList Component', () => {
  beforeEach(() => {
    (HelpService.getDistributorList as jest.Mock).mockResolvedValue({ data: mockDistributors });
  });

  test('renders loading spinner initially', () => {
    render(<ContactList />);
    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  test('renders error message on fetch failure', async () => {
    (HelpService.getDistributorList as jest.Mock).mockRejectedValue(new Error('Fetch Error'));
    render(<ContactList />);
    await waitFor(() => {
      expect(screen.getByText('Error in processing data')).toBeInTheDocument();
    });
  });

  test('renders contact list after data is fetched', async () => {
    render(<ContactList />);
    await waitFor(() => {
      expect(screen.getByText('Contact List')).toBeInTheDocument();
      expect(screen.getByText('Distributor One')).toBeInTheDocument();
      expect(screen.getByText('one@example.com')).toBeInTheDocument();
      expect(screen.getByText('Distributor Two')).toBeInTheDocument();
      expect(screen.getByText('two@example.com')).toBeInTheDocument();
    });
  });

  test('filters contact list based on search input', async () => {
    render(<ContactList />);
    await waitFor(() => {
      expect(screen.getByText('Distributor One')).toBeInTheDocument();
      expect(screen.getByText('Distributor Two')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'One' } });
    await waitFor(() => {
      expect(screen.getByText('Distributor One')).toBeInTheDocument();
      expect(screen.queryByText('Distributor Two')).toBeNull();
    });
  });

  test('sorts contact list by name', async () => {
    render(<ContactList />);
    await waitFor(() => {
      expect(screen.getByText('Distributor One')).toBeInTheDocument();
      expect(screen.getByText('Distributor Two')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Name'));
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Distributor One');
      expect(rows[2]).toHaveTextContent('Distributor Two');
    });
  });
});