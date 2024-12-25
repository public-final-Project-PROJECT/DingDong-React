import CryptoJS from 'crypto-js';

export const encryptData = (data, secretKey) => 
{
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return ciphertext;
};

export const decryptData = (ciphertext, secretKey) => 
{
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
