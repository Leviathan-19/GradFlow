// Logging middleware for service communication tracking

interface LogEntry {
  timestamp: string;
  service: string;
  endpoint: string;
  method?: string;
  status?: string;
  data?: any;
  duration?: number;
}

const logs: LogEntry[] = [];
const MAX_LOGS = 1000; // Keep last 1000 log entries

export const logServiceCall = (
  service: string,
  endpoint: string,
  data?: any,
  status?: string
) => {
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    service,
    endpoint,
    status,
    data: data ? JSON.stringify(data).substring(0, 500) : undefined, // Limit log size
  };

  logs.push(logEntry);

  // Keep only last MAX_LOGS entries
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }

  // Console log for development
  console.log(`[${logEntry.timestamp}] ${service}/${endpoint}`, {
    status,
    data: logEntry.data,
  });
};

export const getServiceLogs = (service?: string, limit: number = 100): LogEntry[] => {
  let filteredLogs = logs;
  
  if (service) {
    filteredLogs = logs.filter((log) => log.service === service);
  }

  return filteredLogs.slice(-limit).reverse(); // Most recent first
};

export const clearLogs = () => {
  logs.length = 0;
};
