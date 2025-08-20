import { TransactionRecord } from "../../models/DataRecord";
import * as fs from "fs/promises";

export class TransactionWriter {
  private lines: string[] = ["timestamp,amount,currency"];

  write(record: TransactionRecord) {
    if (!record.timestamp || !record.amount || !record.currency) {
      throw new Error("Invalid TransactionRecord");
    }

    const line = `${record.timestamp},${record.amount},${record.currency}`;
    this.lines.push(line);
  }

  async finalize() {
    const content = this.lines.join("\n");
    await fs.writeFile("transactions.csv", content, "utf-8");
  }
}
