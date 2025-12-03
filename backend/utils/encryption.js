const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, secretKey, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

const decrypt = (encryptedData) => {
  const { encrypted, iv, authTag } = encryptedData;
  
  const decipher = crypto.createDecipher(algorithm, secretKey, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateSalt = (length = 16) => {
  return crypto.randomBytes(length).toString('hex');
};

const hashWithSalt = (data, salt) => {
  return crypto.createHash('sha256').update(data + salt).digest('hex');
};

const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const createHMAC = (data, secret = process.env.HMAC_SECRET) => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

const verifyHMAC = (data, signature, secret = process.env.HMAC_SECRET) => {
  const expectedSignature = createHMAC(data, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};

const encryptSensitiveData = (data) => {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  return encrypt(data);
};

const decryptSensitiveData = (encryptedData) => {
  const decrypted = decrypt(encryptedData);
  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
};

module.exports = {
  encrypt,
  decrypt,
  hashPassword,
  comparePassword,
  generateSalt,
  hashWithSalt,
  generateSecureToken,
  createHMAC,
  verifyHMAC,
  encryptSensitiveData,
  decryptSensitiveData
};