import { uint256 } from "starknet";
import { BigNumberish } from "starknet/dist/utils/number";

export function toUint256WithFelts(num: BigNumberish) {
  const n = uint256.bnToUint256(num);
  return {
    low: BigInt(n.low.toString()),
    high: BigInt(n.high.toString()),
  };
}

// This is a utility function which helps us convert the Uint256 response
// in Cairo to a number
export function fromUint256WithFelts(uint256WithFelts: any) {
  return uint256.uint256ToBN({
    low: uint256WithFelts.low.toString(),
    high: uint256WithFelts.high.toString(),
  });
}

export function strToFeltArr(str: string) {
  const size = Math.ceil(str.length / 31);
  const arr = Array(size);

  let offset = 0;
  for (let i = 0; i < size; i++) {
    const substr = str.substring(offset, offset + 31).split("");
    const ss = substr.reduce(
      (memo, c) => memo + c.charCodeAt(0).toString(16),
      ""
    );
    arr[i] = BigInt("0x" + ss);
    offset += 31;
  }
  return arr;
}

/**
 * Converts an array of utf-8 numerical short strings into a readable string
 * @param {bigint[]} felts - The array of encoded short strings
 * @returns {string} - The readable string
 */
export function feltArrToStr(felts: any) {
  return felts.reduce(
    (memo: any, felt: any) =>
      memo + Buffer.from(felt.toString(16), "hex").toString(),
    ""
  );
}
