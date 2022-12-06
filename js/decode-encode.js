const base64Encode = (text) => {
  const base64data = Utilities.base64Encode(text, Utilities.Charset.UTF_8);
  return base64data;
};

const base64Decode = (base64data) => {
  const decoded = Utilities.base64Decode(base64data, Utilities.Charset.UTF_8);
  const input = Utilities.newBlob(decoded).getDataAsString();
  return input;
};

const encrypt = (text) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

const decrypt = (data) => {
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};

const encryptWithAES = (text, passphrase) => {
  return CryptoJS.AES.encrypt(
    text.replace(/\n*$/g, '').replace(/\n/g, ''),
    passphrase
  ).toString();
};

const decryptWithAES = (ciphertext, passphrase) => {
  return CryptoJS.AES.decrypt(ciphertext, passphrase).toString(
    CryptoJS.enc.Utf8
  );
};
