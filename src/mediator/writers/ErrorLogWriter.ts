import { SystemErrorRecord } from "../../models/DataRecord";
import * as fs from "fs/promises";

export class ErrorLogWriter {
  private lines: string[] = [];

  write(record: SystemErrorRecord) {
    if (!record.timestamp || !record.level || !record.message) {
      throw new Error("Invalid SystemErrorRecord");
    }

    const line = `[${record.timestamp}] [${record.level}] ${record.message}`;
    this.lines.push(line);
  }

  async finalize() {
    const content = this.lines.join("\n");
    await fs.mkdir("src/output", { recursive: true });
    await fs.writeFile("src/output/error.log", content, "utf-8");
  }
}
