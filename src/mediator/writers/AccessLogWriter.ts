import { AccessLogRecord } from "../../models/DataRecord";
import * as fs from "fs/promises";

export class AccessLogWriter {
  private lines: string[] = ["timestamp,ip,userId"];

  write(record: AccessLogRecord) {
    if (!record.timestamp || !record.ip || !record.userId) {
      throw new Error("Invalid AccessLogRecord");
    }
    const line = `${record.timestamp},${record.ip},${record.userId}`;
    this.lines.push(line);
  }

  async finalize() {
    const content = this.lines.join("\n");
    await fs.mkdir("src/output", { recursive: true });
    await fs.writeFile("src/output/access_logs.csv", content, "utf-8");
  }
}
