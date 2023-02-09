import * as http from 'http';

export interface IRpcClientOptions {
    username: string;
    password: string;
    host: string;
    port: number;
    timeout: number;
}

export interface IRpcResult {
    error?: string;
    data?: any;
    statusCode?: number;
    IECode?: number;
    EECode?: number;
}

export class RpcClient {
    constructor(
        private options: IRpcClientOptions,
    ) { }

    async call(method: string, ...args: any[]): Promise<IRpcResult> {
        const requestObj = {
            id: Date.now(),
            method: method,
            params: args,
        };
        const requestJSON = JSON.stringify(requestObj);
        const { host, port, username, password, timeout } = this.options;
        const requestOptions = {
            host: host,
            port: port,
            method: 'POST',
            headers: {
              'Host': 'localhost',
              'Content-Length': requestJSON.length,
            },
            agent: false,
            auth:  username + ':' + password,
        };
        const request = http.request(requestOptions);

        return new Promise((res, rej) => {
            const reqTimeOut = setTimeout(() => res({ error: 'ETIMEDOUT' }), timeout);
            request.on('error', (error) => res({ error: error.message }));
            request.on('response', (response) => {
                clearTimeout(reqTimeOut);
                let buffer = '';
                response.on('data', (chunk) => buffer += chunk);
                response.on('end', () => {
                    const { statusCode } = response;
                    try {
                        if (statusCode === 401) {
                            res({ error: 'Unauthorized', statusCode, IECode: 4 });
                            return;
                        }
                        // if (statusCode !== 200) return res({ error: 'Undefined Error', statusCode, IECode: 5 })
                        const decRes = JSON.parse(buffer);
                        if(decRes.hasOwnProperty('error') && decRes.error !== null) {
                            res({
                                error: decRes.error.message,
                                statusCode,
                                IECode: 2,
                                EECode: decRes.error.code || 0,
                            });
                            return;
                        }
                        if(decRes.hasOwnProperty('result')) {
                            res({ data: decRes.result, statusCode });
                            return;
                        }
                        res({
                            error: decRes.error?.message || 'Undefined Error',
                            statusCode,
                            IECode: 3,
                            EECode: decRes.error?.code || 0,
                        });

                    } catch (error) {
                        if (statusCode !== 200) {
                            res({ error: error.message, statusCode });
                            return;
                        }
                        res({ error: error.message, statusCode, IECode: 1 });
                    }
                });
              });

            request.end(requestJSON);
        });    
    }
}
