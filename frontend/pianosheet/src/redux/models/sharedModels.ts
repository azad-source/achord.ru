import { CustomHeaders } from './userModels';

export interface BaseQueryParams {
    url: string;
    params?: Record<string, any>;
    body?: FormData;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: CustomHeaders;
}

export interface ResponseError {
    status: number;
    data: {
        detail?: string;
    };
}

export interface ResultResponse {
    result: string;
}
