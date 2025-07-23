import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import FileService from './FileService';
import { baseuriConfig } from '../config/baseuriConfig';
import { REACT_APP_API_URL } from "../helpers/constants";

describe('FileService', () => {
  let mock: MockAdapter;
  let url : string;
  beforeEach(() => {
    url = REACT_APP_API_URL;
    mock = new MockAdapter(axios);
    localStorage.setItem('token', 'test-token');
    sessionStorage.setItem('name', 'test-user');
  });

  afterEach(() => {
    mock.restore();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should fetch file versions successfully', async () => {
    const mockData = { data: 'file version data' };
    mock.onGet(`${url}${baseuriConfig.FIEL_VERSION_INFO}`).reply(200, mockData);

    const response = await FileService.getFileVersions();

    expect(response.data).toEqual(mockData);
  });

  it('should handle error when fetching file versions', async () => {
    mock.onGet(`${url}${baseuriConfig.FIEL_VERSION_INFO}`).reply(500);

    await expect(FileService.getFileVersions()).rejects.toThrow('Request failed with status code 500');
  });

  it('should upload chunk successfully', async () => {
    const mockData = { data: 'upload chunk response' };
    const chunkFormData = new FormData();
    const chunk_no = 1;
    mock.onPost(`${url}${baseuriConfig.FILEUPLOADCHUNK}?username=test-user`).reply(200, mockData);

    const response = await FileService.uploadChunk(chunkFormData, chunk_no, 'Yes');

    expect(response.data).toEqual(mockData);
  });

  it('should handle error when uploading chunk', async () => {
    const chunkFormData = new FormData();
    const chunk_no = 1;
    mock.onPost(`${url}${baseuriConfig.FILEUPLOADCHUNK}?username=test-user`).reply(500);

    await expect(FileService.uploadChunk(chunkFormData, chunk_no, 'Yes')).rejects.toThrow('Request failed with status code 500');
  });

  it('should upload file if isChunk is not Yes', async () => {
    const mockData = { data: 'upload file response' };
    const chunkFormData = new FormData();
    const chunk_no = 1;
    mock.onPost(`${url}${baseuriConfig.FILEUPLOAD}?username=test-user`).reply(200, mockData);

    const response = await FileService.uploadChunk(chunkFormData, chunk_no, 'No');

    expect(response.data).toEqual(mockData);
  });
});