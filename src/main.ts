import * as fs from "fs/promises";
import { DataRecord } from "./models/DataRecord";
import { buildAccessLogChain } from "./chain/chains/AccessLogChain";
import { buildTransactionChain } from "./chain/chains/TransactionChain";
import { buildSystemErrorChain } from "./chain/chains/SystemErrorChain";
import { ProcessingMediator } from "./mediator/ProcessingMediator";

const handlerMap: any = {
  access_log: buildAccessLogChain,
  transaction: buildTransactionChain,
  system_error: buildSystemErrorChain,
};

async function main() {
  const data = await fs.readFile("src/data/records.json", "utf-8");
  const records: DataRecord[] = JSON.parse(data);

  console.log(`[INFO] Завантажено записів: ${records.length}`);

  const mediator = new ProcessingMediator();

  for (const rec of records) {
    const builder = handlerMap[rec.type];
    if (!builder) {
      mediator.onRejected(rec, "Unknown type");
      continue;
    }
    const chain = builder();
    try {
      const processed = chain.handle(rec);
      mediator.onSuccess(processed);
    } catch (e: any) {
      mediator.onRejected(rec, e.message);
    }
  }

  await mediator.finalize();
}

main();
