import { AxiosError } from 'axios';

export function isAxiosError(err?: Error): err is AxiosError {
    return (err as AxiosError)?.isAxiosError === true;
}
