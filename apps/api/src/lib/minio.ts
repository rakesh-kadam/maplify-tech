import { Client } from 'minio';

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'localhost';
const MINIO_PORT = parseInt(process.env.MINIO_PORT || '9000');
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'minioadmin';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'minioadmin123';
const MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true';

export const minioClient = new Client({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: MINIO_USE_SSL,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

export const BUCKET_NAME = 'drawboard-files';

// Initialize bucket on startup
export async function initializeMinIO() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✅ Created MinIO bucket: ${BUCKET_NAME}`);
    } else {
      console.log(`✅ MinIO bucket exists: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.error('❌ MinIO initialization failed:', error);
    throw error;
  }
}

export async function uploadFile(
  fileName: string,
  data: Buffer | string,
  metadata?: Record<string, string>
): Promise<string> {
  await minioClient.putObject(BUCKET_NAME, fileName, data);
  return fileName;
}

export async function getFile(fileName: string): Promise<Buffer> {
  const stream = await minioClient.getObject(BUCKET_NAME, fileName);
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function deleteFile(fileName: string): Promise<void> {
  await minioClient.removeObject(BUCKET_NAME, fileName);
}
