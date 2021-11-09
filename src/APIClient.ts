import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import RPS from 'axios-rate-limit';

/**
 * Generic REST API client.
 */
export class APIClient
{
    protected instance: AxiosInstance;

    private maxRetry: number;

    public constructor(baseUrl: string, authToken: string, maxRequestsPerSecond: number = 0, maxRetry: number = 3)
    {
        this.maxRetry = maxRetry;

        // default AxiosRequestConfig
        const clientConfig: AxiosRequestConfig = {
            baseURL: baseUrl,
            // include credentials for cross-site requests
            withCredentials: true,
            headers:
            {
                //@ts-ignore
                common:
                {
                    'Authorization': authToken,
                    "Content-Type": "application/json"
                }
            }
        };
        
        // create axios client instance
        this.instance = RPS(axios.create(clientConfig), { maxRPS: maxRequestsPerSecond ? maxRequestsPerSecond : undefined });  

        // add request interceptor
        this.instance.interceptors.request.use((request) => { return this.BeforeRequestSend(request); }, undefined);
    }

    private async BeforeRequestSend(request: AxiosRequestConfig): Promise<AxiosRequestConfig> 
    {
        // log the requests
        console.log(`${request.method?.toUpperCase()} ${request.baseURL}${request.url} ${JSON.stringify({ data: { ...request.data }, params: new URLSearchParams(request.params).toString() })}`);

        // send of the request...
        return request;
    }

    /** GENERAL HTTP CLIENT METHODS */
    
    public async GET(url: string, params?: URLSearchParams | undefined, headers?: any | undefined): Promise<any>
    {
        return this.SEND(url, "get", { params: params ? params : {}, headers: headers ? headers : {} });
    }

    public async POST(url: string, data?: any | undefined, headers?: any | undefined): Promise<any>
    {
        return this.SEND(url, "post", { data: data ? data : {}, headers: headers ? headers : {} });
    }

    public async PUT(url: string, data?: any | undefined, headers?: any | undefined): Promise<any>
    {
        return this.SEND(url, "put", { data: data ? data : {}, headers: headers ? headers : {} });
    }

    public async PATCH(url: string, data?: any | undefined, headers?: any | undefined): Promise<any>
    {
        return this.SEND(url, "patch", { data: data ? data : {}, headers: headers ? headers : {} });
    }

    public async DELETE(url: string, params?: URLSearchParams | undefined, headers?: any | undefined): Promise<any>
    {
        return this.SEND(url, "delete", { params: params ? params : {}, headers: headers ? headers : {} });
    }

    protected async SEND(url: string, method: string, config: any, retry?: number): Promise<any>
    {
        return this.instance.request({ url: url, method: method, ...config })
            /** No error occured, just return response data */
            .then(response => { return response.data; })
            /** Something went wrong */
            .catch(async error => 
            {
                /** The request was made and the server responded with a status code that falls out of the range of 2xx */
                if(error.response) 
                { 
                    console.error(`${error.response.status}: ${error.response.statusText}\nDetails: ${JSON.stringify(error.response.data)}\nRequest: ${JSON.stringify({ ...config })}`);

                    const _retry = retry || 1;
                    if(error.response.status == 429 && (_retry < this.maxRetry)) 
                    {
                        // try again after a short delay
                        return await new Promise((resolve, _) => { setTimeout(() => { resolve(this.SEND(url, method, config, _retry + 1)); }, _retry * 1000); });
                    }
                    else
                    {
                        // throw error
                        throw error;
                    }
                }
                /** The request was made but no response was received */
                else if(error.request) 
                { 
                    // log error and go to error view
                    console.error(error.message);
                    throw error;
                }

            });
    }
}