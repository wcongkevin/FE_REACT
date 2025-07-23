import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import webappWiki from './webappWiki'; 
import HelpService from '../../services/HelpService';

jest.mock('../../services/HelpService');

describe('webappWiki Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('loads content on mount', async () => {
    const mockContent = { content: '<p>Sample content</p>' };
    (HelpService.onboardRetailerGet as jest.Mock).mockResolvedValue({ data: mockContent });

    render(
      <Router>
        <webappWiki />
      </Router>
    );

    await waitFor(() => {
      expect(HelpService.onboardRetailerGet).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Please Wait....')).not.toBeInTheDocument();
      expect(screen.getByText('Sample content')).toBeInTheDocument();
    });
  });

  test('handles error when loading content fails', async () => {
    (HelpService.onboardRetailerGet as jest.Mock).mockRejectedValue(new Error('Error fetching data'));

    render(
      <Router>
        <webappWiki />
      </Router>
    );

    await waitFor(() => {
      expect(HelpService.onboardRetailerGet).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Please Wait....')).not.toBeInTheDocument();
      expect(screen.queryByText('Sample content')).not.toBeInTheDocument();
    });
  });
});