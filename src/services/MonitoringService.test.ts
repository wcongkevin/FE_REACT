import axios from "axios";
import MonitoringService from "./MonitoringService";
import { baseuriConfig } from "../config/baseuriConfig";
import { REACT_APP_API_URL } from "../helpers/constants";
import { Monitoring } from "../class/monitoring";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("MonitoringService", () => {
  const userEmail = "test@example.com";
  const token = "test-token";
  const url = REACT_APP_API_URL;

  beforeEach(() => {
    localStorage.setItem("token", token);
    sessionStorage.setItem("user_email", userEmail);
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("should fetch data by ID successfully", async () => {
    const mockData = { data: "dropdown data" };
    const mockupUrl = `${url}${baseuriConfig.MONITORING_DROPDOWN_DATA}?user_id=null`;
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await MonitoringService.getDataById();

    expect(response.data).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(mockupUrl, {
      headers: expect.any(Object),
    });
  });

  it("should handle error when fetching data by ID", async () => {
    const mockupUrl = `${url}${baseuriConfig.MONITORING_DROPDOWN_DATA}?user_id=null`;
    mockedAxios.get.mockRejectedValueOnce(
      new Error("Request failed with status code 500"),
    );

    await expect(MonitoringService.getDataById()).rejects.toThrow(
      "Request failed with status code 500",
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(mockupUrl, {
      headers: expect.any(Object),
    });
  });

  it("should post monitoring data by ID successfully", async () => {
    const mockData = { data: "post response" };
    const monitoring: Monitoring = new Monitoring(
      "1",
      ["Test Monitoring"],
      ["active"],
      ["test"],
      new Date().toISOString(),
      new Date().toISOString(),
    );
    const mockupURL = `${url}${baseuriConfig.MONITORING_SCREEN_DATA}`;
    mockedAxios.post.mockResolvedValueOnce({ data: mockData });

    const response = await MonitoringService.postMonitoringDataById(monitoring);

    expect(response.data).toEqual(mockData);
    expect(mockedAxios.post).toHaveBeenCalledWith(mockupURL, monitoring, {
      headers: expect.any(Object),
    });
  });

  it("should handle error when posting monitoring data by ID", async () => {
    const monitoring: Monitoring = new Monitoring(
      "1",
      ["Test Monitoring"],
      ["active"],
      ["test"],
      new Date().toISOString(),
      new Date().toISOString(),
    );
    const mockupURL = `${url}${baseuriConfig.MONITORING_SCREEN_DATA}`;
    mockedAxios.post.mockRejectedValueOnce(
      new Error("Request failed with status code 500"),
    );

    await expect(
      MonitoringService.postMonitoringDataById(monitoring),
    ).rejects.toThrow("Request failed with status code 500");
    expect(mockedAxios.post).toHaveBeenCalledWith(mockupURL, monitoring, {
      headers: expect.any(Object),
    });
  });

  it("should fetch monitoring data by ID successfully", async () => {
    const mockData = { data: "monitoring data" };
    const mockupUrl = `${url}${baseuriConfig.MONITORING_SCREEN_DATA}?user_id=null`;
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await MonitoringService.getMonitoringDataById();

    expect(response.data).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(mockupUrl, {
      headers: expect.any(Object),
    });
  });

  it("should handle error when fetching monitoring data by ID", async () => {
    const mockupUrl = `${url}${baseuriConfig.MONITORING_SCREEN_DATA}?user_id=null`;
    mockedAxios.get.mockRejectedValueOnce(
      new Error("Request failed with status code 500"),
    );

    await expect(MonitoringService.getMonitoringDataById()).rejects.toThrow(
      "Request failed with status code 500",
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(mockupUrl, {
      headers: expect.any(Object),
    });
  });
});
