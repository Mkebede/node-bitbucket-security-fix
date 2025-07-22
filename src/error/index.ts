type Headers = import('./types').Headers
type RequestOptions = import('./types').RequestOptions

type AbstractHTTPError = import('./types').HTTPError

function sanitizeRequest(request: RequestOptions | undefined): RequestOptions | undefined {
  if (!request) return request

  const sanitizedHeaders = { ...request.headers }
  if (sanitizedHeaders.authorization) {
    sanitizedHeaders.authorization = '[REDACTED]'
  }
  
  return {
    ...request,
    headers: sanitizedHeaders
  }
}

export class HTTPError extends Error implements AbstractHTTPError {
  public error: any | undefined
  public headers: Headers | undefined
  public request: RequestOptions | undefined
  public status: number

  public constructor(
    message: string,
    statusCode: number,
    options: {
      error?: any
      headers?: Headers
      request?: RequestOptions
    } = {}
  ) {
    super(message)

    // Maintains proper stack trace (only available on V8)
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor)

    this.name = 'HTTPError'
    this.error = options.error
    this.headers = options.headers
    this.request = sanitizeRequest(options.request)
    this.status = statusCode
  }
}
