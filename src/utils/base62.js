const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function toBase62(number) {
  if (!Number.isSafeInteger(number) || number < 0) {
    throw new TypeError("Base62 encoding requires a non-negative safe integer.");
  }

  if (number === 0) {
    return ALPHABET[0];
  }

  let value = number;
  let encoded = "";

  while (value > 0) {
    encoded = ALPHABET[value % 62] + encoded;
    value = Math.floor(value / 62);
  }

  return encoded;
}

module.exports = { toBase62 };
