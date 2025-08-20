import { AbstractHandler } from "../AbstractHandler";

export class TimestampParser extends AbstractHandler {
  protected process(record: any): any {
    if (!record.timestamp || isNaN(Date.parse(record.timestamp))) {
      throw new Error("Invalid timestamp");
    }
    return { ...record, timestamp: new Date(record.timestamp).toISOString() };
  }
}
