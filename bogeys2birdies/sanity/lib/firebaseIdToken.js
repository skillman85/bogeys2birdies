import { createVerify } from 'node:crypto';

const certificateUrl = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
let certificateCache = { expiresAt: 0, certificates: null };

function decodeBase64Url(value) { return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64'); }
function parseJsonSegment(segment, label) {
  try { return JSON.parse(decodeBase64Url(segment).toString('utf8')); }
  catch { throw new Error(`Invalid Firebase token ${label}.`); }
}
async function getFirebaseCertificates() {
  if (certificateCache.certificates && Date.now() < certificateCache.expiresAt) return certificateCache.certificates;
  const response = await fetch(certificateUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error('Firebase signing certificates are unavailable.');
  const certificates = await response.json();
  const maxAge = Number(response.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1] || 300);
  certificateCache = { certificates, expiresAt: Date.now() + Math.max(60, maxAge) * 1000 };
  return certificates;
}
export async function verifyFirebaseIdToken(token, projectId) {
  if (!token || token.length > 8192 || !projectId) throw new Error('Firebase authentication is not configured.');
  const segments = token.split('.');
  if (segments.length !== 3) throw new Error('Invalid Firebase token format.');
  const [encodedHeader, encodedPayload, encodedSignature] = segments;
  const header = parseJsonSegment(encodedHeader, 'header');
  const payload = parseJsonSegment(encodedPayload, 'payload');
  if (header.alg !== 'RS256' || typeof header.kid !== 'string' || !header.kid) throw new Error('Invalid Firebase token signing method.');
  const certificate = (await getFirebaseCertificates())[header.kid];
  if (!certificate) throw new Error('Unknown Firebase token signing key.');
  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();
  if (!verifier.verify(certificate, decodeBase64Url(encodedSignature))) throw new Error('Invalid Firebase token signature.');
  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error('Firebase token belongs to another project.');
  if (typeof payload.sub !== 'string' || !payload.sub || payload.sub.length > 128) throw new Error('Firebase token has no valid user ID.');
  if (typeof payload.exp !== 'number' || payload.exp <= now) throw new Error('Firebase token has expired.');
  if (typeof payload.iat !== 'number' || payload.iat > now + 60) throw new Error('Firebase token has an invalid issue time.');
  if (typeof payload.auth_time !== 'number' || payload.auth_time > now + 60) throw new Error('Firebase token has an invalid authentication time.');
  return payload;
}
