import CryptoJS from "crypto-js";

// Encrypts a private key with a secret
export function encryptPrivateKey(privateKey: string, secret: string): string {
  return CryptoJS.AES.encrypt(privateKey, secret).toString();
}

// Decrypts an encrypted private key with a secret
export function decryptPrivateKey(encrypted: string, secret: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}
