import { isAxiosError } from '../utils/axios';

// Место для набивания маппинга ошибок в человеческую форму.
export class ErrorPrinter {
    constructor(
        private readonly error?: Error,
        private readonly errorName?: string,
    ) {}

    public getErrorMessage(): string | null {
        if (!this.error) {
            return null;
        }

        const axiosErr = this.axiosErrorMessage();
        if (axiosErr !== null) {
            return axiosErr;
        }

        return this.error.message ?? this.error.name;
    }

    private axiosErrorMessage(): string | null {
        if (!isAxiosError(this.error)) {
            return null;
        }

        if (
            this.error.code === 'ECONNABORTED' &&
            this.error.message.startsWith('timeout')
        ) {
            return 'Время ожидания запроса истекло';
        }
        if (this.error.message === 'Network Error') {
            return 'Ошибка сети';
        }
        if (
            this.error.request.status === 404 ||
            this.error.message === 'Request failed with status code 404'
        ) {
            return 'Ресурс не найден';
        }
        if (this.error.response?.status === 500) {
            return 'Ошибка сервера';
        }

        if (this.error.response?.status === 403) {
            return 'Недостаточно прав';
        }
        if (this.error.response?.status === 401) {
            return 'Вы не авторизованы';
        }

        return null;
    }
}
