/**
 * API Error Classes
 */

import type { ApiError } from "./types";

export class ApiClientError extends Error {
    constructor(
        public readonly response: ApiError,
        message?: string
    ) {
        super(message || response.message);
        this.name = "ApiClientError";
        Object.setPrototypeOf(this, ApiClientError.prototype);
    }

    get statusCode(): number {
        return this.response.statusCode;
    }

    get type(): string {
        return this.response.type;
    }

    get requestId(): string {
        return this.response.requestId;
    }

    get isClientError(): boolean {
        return this.response.statusCode >= 400 && this.response.statusCode < 500;
    }

    get isServerError(): boolean {
        return this.response.statusCode >= 500;
    }

    get isUnauthorized(): boolean {
        return this.response.statusCode === 401;
    }

    get isForbidden(): boolean {
        return this.response.statusCode === 403;
    }

    get isNotFound(): boolean {
        return this.response.statusCode === 404;
    }
}

export class NetworkError extends Error {
    constructor(message: string, public readonly cause?: Error) {
        super(message);
        this.name = "NetworkError";
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}

export class TokenRefreshError extends Error {
    constructor(message = "Token yenileme başarısız") {
        super(message);
        this.name = "TokenRefreshError";
        Object.setPrototypeOf(this, TokenRefreshError.prototype);
    }
}
