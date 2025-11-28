export class Logger {
  static info(message: string) {
    console.log(`ℹ️  INFO: ${message}`);
  }

  static step(message: string) {
    console.log(`🟣 STEP: ${message}`);
  }

  static warn(message: string) {
    console.warn(`⚠️  WARN: ${message}`);
  }

  static error(message: string) {
    console.error(`❌ ERROR: ${message}`);
  }
}
