// import { getPool } from "./infura";
// import { ESBS } from "../constants/tokens";
import {
  BitcoinPool1
} from "../constants/contracts";

export async function getPoolAddress(): Promise<string> {
  return BitcoinPool1
  // const pool = await getPool(ESBS.addr);
  // if (pool.toLowerCase() === DollarPool2.toLowerCase()) {
  //   return DollarPool2;
  // }
  // if (pool.toLowerCase() === DollarPool3.toLowerCase()) {
  //   return DollarPool3;
  // }
  // if (pool.toLowerCase() === DollarPool4.toLowerCase()) {
  //   return DollarPool4;
  // }
  // throw new Error("Unrecognized Pool Address");
}

export function getLegacyPoolAddress(poolAddress): string {
  return BitcoinPool1
  // if (poolAddress === DollarPool2) {
  //   return DollarPool1;
  // }
  // if (poolAddress === DollarPool3) {
  //   return DollarPool2;
  // }
  // if (poolAddress === DollarPool4) {
  //   return DollarPool3;
  // }
  // throw new Error("Unrecognized Pool Address");
}
