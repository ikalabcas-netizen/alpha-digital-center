/**
 * Structured JSON logger — output qua stdout/stderr cho Coolify/Docker capture.
 * Đọc Coolify UI hoặc `docker logs <container>` để xem.
 *
 * Mỗi log line là 1 dòng JSON — dễ grep và parse sau này (jq, log aggregator).
 */

type Level = 'debug' | 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

type LogRecord = {
  level: Level;
  timestamp: string;
  message: string;
  context?: LogContext;
  error?: { name: string; message: string; stack?: string };
  env: string;
  service: string;
};

const SERVICE = 'adc-marketing';
const ENV = process.env.NODE_ENV || 'development';

function serializeError(err: unknown): LogRecord['error'] | undefined {
  if (!err) return undefined;
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  // Non-Error thrown (string, object, etc.)
  return { name: 'Unknown', message: String(err) };
}

function write(record: LogRecord) {
  const line = JSON.stringify(record);
  if (record.level === 'error') {
    // stderr cho errors — Coolify phân stream
    process.stderr.write(line + '\n');
  } else {
    process.stdout.write(line + '\n');
  }
}

function log(level: Level, message: string, contextOrError?: LogContext | unknown, extraContext?: LogContext) {
  // Overloads: log('error', msg, err, {ctx}) hoặc log('info', msg, {ctx})
  let context: LogContext | undefined;
  let error: LogRecord['error'] | undefined;

  if (contextOrError instanceof Error) {
    error = serializeError(contextOrError);
    context = extraContext;
  } else if (contextOrError && typeof contextOrError === 'object') {
    context = contextOrError as LogContext;
  }

  write({
    level,
    timestamp: new Date().toISOString(),
    message,
    ...(context && Object.keys(context).length > 0 ? { context } : {}),
    ...(error ? { error } : {}),
    env: ENV,
    service: SERVICE,
  });
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (ENV === 'production') return; // skip debug in prod
    log('debug', message, context);
  },
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  /** logger.error('DB query failed', err, { userId, query }) */
  error: (message: string, err?: unknown, context?: LogContext) => log('error', message, err, context),
};

export type Logger = typeof logger;
