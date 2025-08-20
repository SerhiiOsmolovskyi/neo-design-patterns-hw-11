import { DataRecord } from "../../models/DataRecord";
import * as fs from "fs/promises";

export class RejectedWriter {
  private lines: string[] = [];

  write(record: DataRecord, error: string) {
    const entry = { record, error };
    this.lines.push(JSON.stringify(entry));
  }

  async finalize() {
    const content = this.lines.join("\n");
    await fs.writeFile("rejected.jsonl", content, "utf-8");
  }
}
