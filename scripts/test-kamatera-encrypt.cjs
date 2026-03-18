const crypto = require('crypto');

const email = process.argv[2] || '53947@businessblueprint.io';
const key = Buffer.from('7srPzhdC25eUu11oYgMCpZDx9oaOKm0Xx5zP9+hxLKI=', 'base64');
const iv = crypto.randomBytes(16);
const hash = crypto.createHash('md5').update(email).digest();

// Pad email to AES block size (16 bytes) with null bytes (matches Kamatera)
const blockSize = 16;
const emailBuf = Buffer.from(email, 'utf8');
const padLen = blockSize - (emailBuf.length % blockSize);
const padded = padLen === blockSize ? emailBuf : Buffer.concat([emailBuf, Buffer.alloc(padLen, 0)]);

const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
cipher.setAutoPadding(false);
const encrypted = Buffer.concat([cipher.update(padded), cipher.final()]);

const result = Buffer.concat([iv, hash, encrypted]).toString('base64');

console.log(`Email:     ${email}`);
console.log(`Encoded:   ${result}`);
console.log(`\nTest URLs:`);
console.log(`  /billing/profile?data=${encodeURIComponent(result)}`);
console.log(`  /support/tickets?data=${encodeURIComponent(result)}`);
console.log(`  /support/tickets/new?data=${encodeURIComponent(result)}`);
console.log(`  /help?data=${encodeURIComponent(result)}`);
