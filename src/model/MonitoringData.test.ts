import { MonitoringData } from './MonitoringData'; 
describe('MonitoringData Interface', () => {
  it('should create a valid MonitoringData object', () => {
    const validMonitoringData: MonitoringData = {
      username: 'testuser',
      Id: 1,
      Market: 'test market',
      Division: 'test division',
      Channel: 'test channel',
      Retailer: 'test retailer',
      UploadDate: new Date('2023-01-01'),
      ProcessDate: new Date('2023-01-02'),
      UploadChannel: 'test upload channel',
      FilesName: 'testfile.txt',
      Execution: 'Success',
      FailureReason: 'None',
      IncidentNo: 'INC123456',
      Status: 'Completed',
      TimeStamp: '2023-01-02T12:34:56Z',
      showMore: true,
    };

    expect(validMonitoringData).toBeTruthy();
    expect(validMonitoringData.username).toBe('testuser');
    expect(validMonitoringData.Id).toBe(1);
    expect(validMonitoringData.Market).toBe('test market');
    expect(validMonitoringData.Division).toBe('test division');
    expect(validMonitoringData.Channel).toBe('test channel');
    expect(validMonitoringData.Retailer).toBe('test retailer');
    expect(validMonitoringData.UploadDate).toEqual(new Date('2023-01-01'));
    expect(validMonitoringData.ProcessDate).toEqual(new Date('2023-01-02'));
    expect(validMonitoringData.UploadChannel).toBe('test upload channel');
    expect(validMonitoringData.FilesName).toBe('testfile.txt');
    expect(validMonitoringData.Execution).toBe('Success');
    expect(validMonitoringData.FailureReason).toBe('None');
    expect(validMonitoringData.IncidentNo).toBe('INC123456');
    expect(validMonitoringData.Status).toBe('Completed');
    expect(validMonitoringData.TimeStamp).toBe('2023-01-02T12:34:56Z');
    expect(validMonitoringData.showMore).toBe(true);
  });

  it('should fail creating an invalid MonitoringData object', () => {
    const invalidMonitoringData: MonitoringData = {
      username: 'testuser',
      Id: 2, 
      Market: 'test market',
      Division: 'test division',
      Channel: 'test channel',
      Retailer: 'test retailer',
      UploadDate: new Date('2023-01-01'),
      ProcessDate: new Date('2023-01-02'),
      UploadChannel: 'test upload channel',
      FilesName: 'testfile.txt',
      Execution: 'Success',
      FailureReason: 'None',
      IncidentNo: 'INC123456',
      Status: 'Completed',
      TimeStamp: '2023-01-02T12:34:56Z',
      showMore: true,
    };

    expect(invalidMonitoringData).toBeTruthy(); 
  });
});