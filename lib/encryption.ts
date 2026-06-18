import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Generate a 32-byte key for development if ENCRYPTION_KEY is not set.
// In production, this MUST be set in environment variables.
const getEncryptionKey = () => {
  const envKey = process.env.ENCRYPTION_KEY;
  if (envKey) {
    if (envKey.length !== 64) {
      console.warn("ENCRYPTION_KEY should be a 64-character hex string (32 bytes)");
    }
    return Buffer.from(envKey, 'hex');
  }
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error("ENCRYPTION_KEY environment variable is required in production");
  }
  
  // Fallback for development only: deterministic key based on something available or just static
  console.warn("Using fallback encryption key for development. Set ENCRYPTION_KEY for secure storage.");
  return crypto.scryptSync('clearpath-dev-secret', 'salt', 32);
};

export interface EncryptedData {
  encrypted_key: string;
  initialization_vector: string;
  authentication_tag: string;
}

export function encrypt(text: string): EncryptedData {
  const iv = crypto.randomBytes(12); // GCM standard is 12 bytes
  const key = getEncryptionKey();
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted_key: encrypted,
    initialization_vector: iv.toString('hex'),
    authentication_tag: authTag.toString('hex')
  };
}

export function decrypt(encryptedData: EncryptedData): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(encryptedData.initialization_vector, 'hex');
  const authTag = Buffer.from(encryptedData.authentication_tag, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData.encrypted_key, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
