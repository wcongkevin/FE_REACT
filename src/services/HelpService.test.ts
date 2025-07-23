import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import HelpService from './HelpService';
import { baseuriConfig } from '../config/baseuriConfig';
import { REACT_APP_API_URL } from "../helpers/constants";

describe('HelpService', () => {
  let mock: MockAdapter;
  let url : string;
  beforeEach(() => {
    url = REACT_APP_API_URL;
    mock = new MockAdapter(axios);
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    mock.restore();
    localStorage.clear();
  });

  it('should fetch retailer data successfully', async () => {
    const mockData = { data: 'retailer data' };
    mock.onGet(`${url}${baseuriConfig.webapp_SERVICE}`).reply(200, mockData);

    const response = await HelpService.onboardRetailerGet();

    expect(response.data).toEqual(mockData);
  });

  it('should handle error when fetching retailer data', async () => {
    mock.onGet(`${url}${baseuriConfig.webapp_SERVICE}`).reply(500);

    await expect(HelpService.onboardRetailerGet()).rejects.toThrow('Request failed with status code 500');
  });

  it('should post retailer data successfully', async () => {
    const mockData = { data: 'retailer data' };
    const jsonDoc = { key: 'value' };
    mock.onPost(`${url}${baseuriConfig.webapp_SERVICE}`, jsonDoc).reply(200, mockData);

    const response = await HelpService.onboardRetailerSet(jsonDoc);

    expect(response.data).toEqual(mockData);
  });

  it('should handle error when posting retailer data', async () => {
    const jsonDoc = { key: 'value' };
    mock.onPost(`${url}${baseuriConfig.webapp_SERVICE}`, jsonDoc).reply(500);

    await expect(HelpService.onboardRetailerSet(jsonDoc)).rejects.toThrow('Request failed with status code 500');
  });

  it('should fetch distributor list successfully', async () => {
    const mockData = { data: 'distributor list' };
    const searchText = 'test';
    const data = { key: searchText };
    mock.onPost(`${url}${baseuriConfig.DISTRIBUTION_LIST}`, data).reply(200, mockData);

    const response = await HelpService.getDistributorList(searchText);

    expect(response.data).toEqual(mockData);
  });

  it('should handle error when fetching distributor list', async () => {
    const searchText = 'test';
    const data = { key: searchText };
    mock.onPost(`${url}${baseuriConfig.DISTRIBUTION_LIST}`, data).reply(500);

    await expect(HelpService.getDistributorList(searchText)).rejects.toThrow('Request failed with status code 500');
  });
});