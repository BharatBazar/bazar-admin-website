export enum statusValue {
    success = 1,
    failed = 0,
}
export interface CommonApiResponse {
    statusCode: number;
    message: string;
    description: string;
    status: statusValue;
}
