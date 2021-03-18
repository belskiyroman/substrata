import httpError from 'http-errors'

export const httpAssert = (
  condition: any,
  statusCode = 500,
  message?: string,
  cb?: () => void,
): void => {
  if (!condition) {
    if (cb) process.nextTick(cb)
    throw httpError(statusCode, message)
  }
}
