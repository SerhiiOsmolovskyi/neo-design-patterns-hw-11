import { AbstractHandler } from "../AbstractHandler";
import { SystemErrorRecord } from "../../models/DataRecord";

const allowed = ["info", "warning", "critical"] as const;

export class LevelValidator extends AbstractHandler {
  protected process(record: SystemErrorRecord): SystemErrorRecord {
    if (!record.level || !allowed.includes(record.level.toLowerCase() as typeof allowed[number])) {
      throw new Error(`Invalid level: ${record.level}`);
    }

    const level = record.level.toLowerCase() as typeof allowed[number];
    return { ...record, level };
  }
}
