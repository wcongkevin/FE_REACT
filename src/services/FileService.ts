// import axios, { AxiosRequestConfig } from "axios";
import axios,{AxiosRequestConfig} from "axios";
import { baseuriConfig } from "../config/baseuriConfig";
import { REACT_APP_API_URL } from "../helpers/constants";

class FileService {
    // private token: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private headers: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private headersForUploadChunk: any;
    private baseUrl: string;

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
        this.headersForUploadChunk = {
            "Content-Type": "multipart/form-data",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers":
                "Origin, X-Auth-Token, X-Requested-With, Content-Type, Authorization,*",
            "Access-Control-Allow-Credentials": "true",
            // Authorization: `Bearer ${this.token}`,
        };
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.baseUrl = REACT_APP_API_URL;
    }

    async getFileVersions() {
        try {
            return await axios.get(
                `${this.baseUrl + baseuriConfig.FIEL_VERSION_INFO}`,
                { headers: this.headers }
            );
        } catch (error) {
            console.error("getFileVersions : Error fetching data by ID:", error);
            throw error;
        }
    }

    async uploadFile(selectedFiles: FormData) {
        try {
            const loggedInUserName = sessionStorage.getItem("name");
            const queryString = "?username=" + loggedInUserName;
            return await axios.post(
                `${(this.baseUrl + queryString, selectedFiles)}`,
                { headers: this.headers }
            );
        } catch (error) {
            console.error("uploadFile : Error fetching data by ID:", error);
            throw error;
        }
    }

    async uploadChunk(chunkFormData, chunk_no, isChunk:string) {
        try {
            const loggedInUserName = sessionStorage.getItem("name");
            const queryString = "?username="+loggedInUserName;
            let api_url = this.baseUrl + baseuriConfig.FILEUPLOAD ;
            if(isChunk === "Yes"){
                api_url = this.baseUrl + baseuriConfig.FILEUPLOADCHUNK ;
            }
            api_url = api_url + queryString ;
            const config: AxiosRequestConfig = {
                headers: this.headersForUploadChunk,
                onUploadProgress: (progressEvent) => {
                  if (progressEvent.lengthComputable) {
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`Chunk no. ${chunk_no} Uploading: ${percentage}%`);
                  }
                }
              };
            return await axios.post(
                api_url, chunkFormData , config);
        } catch (error) {
            console.error("uploadChunk : Error fetching data by ID:", error);
            throw error;
        }
    }
}
export default new FileService();
