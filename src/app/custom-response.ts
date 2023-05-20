export interface CustomResponse<T> {
    timeStamp: Date
    statusCode: number
    status: string
    reason: string
    message: string
    developerMessage: string
    data?: T
}