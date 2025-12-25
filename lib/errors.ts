export class AppError extends Error {
  public status: number;
  public code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'AppError';

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
