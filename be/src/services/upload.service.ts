import { imagekit } from '../config/imagekit';

export const uploadFile = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
  try {
    const response = await imagekit.upload({
      file: fileBuffer.toString('base64'),
      fileName: fileName,
      folder: '/rt-prioritas/complaints'
    });
    return response.url;
  } catch (error) {
    console.error("Error uploading to ImageKit:", error);
    throw new Error("Gagal mengupload file");
  }
};
