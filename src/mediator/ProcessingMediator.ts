import { DataRecord } from "../models/DataRecord";
import { AccessLogWriter } from "./writers/AccessLogWriter";
import { TransactionWriter } from "./writers/TransactionWriter";
import { ErrorLogWriter } from "./writers/ErrorLogWriter";
import { RejectedWriter } from "./writers/RejectedWriter";

export class ProcessingMediator {
  private accessLogWriter = new AccessLogWriter();
  private transactionWriter = new TransactionWriter();
  private errorWriter = new ErrorLogWriter();
  private rejectedWriter = new RejectedWriter();

  private processed = 0;
  private rejected = 0;

  onSuccess(record: DataRecord): void {
    this.processed++;
    switch (record.type) {
      case "access_log":
        this.accessLogWriter.write(record);
        break;
      case "transaction":
        this.transactionWriter.write(record);
        break;
      case "system_error":
        this.errorWriter.write(record);
        break;
    }
  }

  onRejected(original: DataRecord, error: string): void {
    this.rejected++;
    this.rejectedWriter.write(original, error);
  }

  async finalize() {
    await this.accessLogWriter.finalize();
    await this.transactionWriter.finalize();
    await this.errorWriter.finalize();
    await this.rejectedWriter.finalize();

    console.log(`[INFO] Успішно оброблено: ${this.processed}`);
    console.log(`[WARN] Відхилено: ${this.rejected}`);
    console.log("[INFO] Звіт збережено у директорії output/");
  }
}
