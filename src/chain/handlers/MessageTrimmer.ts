import { AbstractHandler } from "../AbstractHandler";
import { SystemErrorRecord } from "../../models/DataRecord";

export class MessageTrimmer extends AbstractHandler {
  protected process(record: SystemErrorRecord): SystemErrorRecord {
    if (!record.message || typeof record.message !== "string") {
      throw new Error("Invalid message");
    }
    return { ...record, message: record.message.trim() };
  }
}
