import { config } from "config";
import assert from "node:assert";

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function waitFor<T>(
  condition: () => Promise<T>, 
  option?: { timeout?: number, delay?: number, factor?: number, message?:string } 
): Promise<void> {
    let startTime = Date.now();
    let timeoutFactor = option?.factor ?? config.waitTimeoutFactor;
    let timeout = option?.timeout ?? config.waitForElement;

    while(Date.now() - startTime < Number(timeout * timeoutFactor) && !(await condition())) {
      if (option?.delay) {
        await delay(option.delay)
      }
    }

    assert.ok(await condition(), `${option?.message ?? 'failed condition'}`)
  };

export { waitFor, delay }