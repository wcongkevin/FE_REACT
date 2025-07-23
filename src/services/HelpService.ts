import axios from "axios";
import { baseuriConfig } from "../config/baseuriConfig";
import { REACT_APP_API_URL } from "../helpers/constants";

class HelpService {
  // private token: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private headers: any;
  private baseUrl: string;
  // private user_email: string | null;

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
    // this.user_email = sessionStorage.getItem("user_email");
  }

  async onboardRetailerGet() {
    try {
      return await axios.get(`${this.baseUrl + baseuriConfig.webapp_SERVICE}`, {
        headers: this.headers,
      });
    } catch (error) {
      console.error("onboardRetailerGet : Error fetching data by ID:", error);
      throw error;
    }
  }

  async onboardRetailerSet(jsonDoc: unknown) {
    try {
      return await axios.post(
        `${this.baseUrl + baseuriConfig.webapp_SERVICE}`,
        jsonDoc,
        { headers: this.headers },
      );
    } catch (error) {
      console.error(
        "onboardRetailerSet : Error posting monitoring data:",
        error,
      );
      throw error;
    }
  }

  async getDistributorList(searchText: string) {
    try {
      const data = { key: searchText };
      return await axios.post(
        `${this.baseUrl + baseuriConfig.DISTRIBUTION_LIST}`,
        data,
        { headers: this.headers },
      );
    } catch (error) {
      console.error(
        "getDistributorList : Error posting monitoring data:",
        error,
      );
      throw error;
    }
  }
}

export default new HelpService();