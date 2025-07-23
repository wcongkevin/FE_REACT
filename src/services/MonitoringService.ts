import axios from "axios";
import { Monitoring } from "../class/monitoring";
import { baseuriConfig } from "../config/baseuriConfig";
import { REACT_APP_API_URL } from "../helpers/constants";

class MonitoringService {
  // private token: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private headers: any;
  private baseUrl: string;
  private user_email: string | null;

  constructor() {
    // this.token = localStorage.getItem("token");
    this.headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, Content-Type, Authorization,*",
      "Access-Control-Allow-Credentials": "true",
      // Authorization: `Bearer ${this.token}`,
    };

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    this.baseUrl = REACT_APP_API_URL;
    this.user_email = sessionStorage.getItem("user_email");
  }

  async getDataById() {
    try {
      return await axios.get(
        `${this.baseUrl + baseuriConfig.MONITORING_DROPDOWN_DATA}?user_id=${
          this.user_email
        }`,
        { headers: this.headers }
      );
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      throw error;
    }
  }
 
  async postMonitoringDataById(monitoring: Monitoring) {
    try {
      return await axios.post(
        `${this.baseUrl + baseuriConfig.MONITORING_SCREEN_DATA}`,
        monitoring,
        { headers: this.headers }
      );
    } catch (error) {
      console.error("postMonitoringDataById : Error posting monitoring data:", error);
      throw error;
    }
  }

  async getMonitoringDataById() {
    try {
      return await axios.get(
        `${this.baseUrl + baseuriConfig.MONITORING_SCREEN_DATA}?user_id=${
          this.user_email
        }`,
        { headers: this.headers }
      );
    } catch (error) {
      console.error("Error fetching monitoring data by ID:", error);
      throw error;
    }
  }
}


export default new MonitoringService();
