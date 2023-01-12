import { ErrorPrinter } from 'domain/ErrorPrinter';
import { immerable } from 'immer';

type Status = 'INITIAL' | 'REQUEST' | 'SUCCESS' | 'ERROR';

export class QueryStatus {
    public readonly [immerable] = true;

    /**
     * Текущий статус запроса.
     */
    private readonly status: Status = 'INITIAL';
    /**
     * Человекочитаемое сообщение об ошибке.
     */
    public readonly errorMessage: string = '';
    /**
     * Название ошибки, по которой можно сформировать человекочитаемое сообщение.
     * TIMEOUT, BAD_REQUEST, 404 что-нибудь в таком духе
     */
    public readonly errorName: string = '';
    /**
     * Непосредственно ошибка.
     */
    public readonly exception?: Error;

    private constructor(
        status: Status,
        errorReason: string = '',
        errorMessage: string = '',
        exception?: Error,
    ) {
        this.status = status;
        this.errorName = errorReason;
        this.errorMessage = errorMessage;
        this.exception = exception;
    }

    public static initial(): QueryStatus {
        return new QueryStatus('INITIAL');
    }
    public static request(): QueryStatus {
        return new QueryStatus('REQUEST');
    }
    public static success(): QueryStatus {
        return new QueryStatus('SUCCESS');
    }
    public static error(reason: string, message: string, exception?: Error): QueryStatus {
        return new QueryStatus('ERROR', reason, message, exception);
    }

    public isInitial(): boolean {
        return this.status === 'INITIAL';
    }
    public isRequest(): boolean {
        return this.status === 'REQUEST';
    }
    public isSuccess(): boolean {
        return this.status === 'SUCCESS';
    }
    public isError(): boolean {
        return this.status === 'ERROR';
    }

    public printErrorMessage(): string | null {
        if (this.status !== 'ERROR') {
            return null;
        }

        return (
            this.errorMessage ||
            new ErrorPrinter(this.exception, this.errorName).getErrorMessage() ||
            this.errorName ||
            'Ошибка'
        );
    }
}
