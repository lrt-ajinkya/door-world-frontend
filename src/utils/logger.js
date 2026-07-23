class Logger {
  constructor() {
    this.enabled = process.env.NODE_ENV === 'development' || localStorage.getItem('apiLogging') === 'true';
  }

  api(method, url, params = null, body = null, response = null, error = null) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      method: method.toUpperCase(),
      url,
      ...(params && { params }),
      ...(body && { body }),
      ...(response && { response }),
      ...(error && { error })
    };

    if (error) {
      console.error(`🚨 [API ERROR] ${method.toUpperCase()} ${url}`, logData);
    } else {
      console.log(`🔍 [API] ${method.toUpperCase()} ${url}`, logData);
    }
  }

  debug(message, data = null) {
    if (!this.enabled) return;
    console.log(`🐛 [DEBUG] ${message}`, data);
  }

  info(message, data = null) {
    if (!this.enabled) return;
    console.log(`ℹ️ [INFO] ${message}`, data);
  }

  warn(message, data = null) {
    console.warn(`⚠️ [WARN] ${message}`, data);
  }

  error(message, error = null) {
    console.error(`❌ [ERROR] ${message}`, error);
  }

  // Enable/disable logging
  enable() {
    this.enabled = true;
    localStorage.setItem('apiLogging', 'true');
  }

  disable() {
    this.enabled = false;
    localStorage.removeItem('apiLogging');
  }
}

const logger = new Logger();
export default logger;