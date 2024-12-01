
export class AppError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class AuthError extends AppError {
	constructor(message: string, statusCode: number = 401) {
		super(message, statusCode);
	}
}

export class ValidationError extends AppError {
	constructor(message: string, statusCode: number = 400) {
		super(message, statusCode);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string, statusCode: number = 404) {
		super(message, statusCode);
	}
}

export class BadRequestError extends AppError {
	constructor(message: string, statusCode: number = 400) {
		super(message, statusCode);
	}
}