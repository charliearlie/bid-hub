import { writeAsyncIterableToWritable } from "@remix-run/node";
import cloudinary from "cloudinary";

export enum UPLOAD_PRESET_ENUM {
  bidhubAvatar = "bidhub_avatar",
  bidhubItem = "bidhub_item",
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function* createAsyncIterable(data: Uint8Array) {
  yield data;
}

export async function uploadImage(
  file: File,
  preset: UPLOAD_PRESET_ENUM = UPLOAD_PRESET_ENUM.bidhubItem
) {
  if (!file) return;

  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const iterableData = createAsyncIterable(data);
  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "bidhub",
        upload_preset: preset,
      },
      (error, result) => {
        if (error) {
          console.error("error", error);
          resolve(null);
          return;
        }
        resolve(result);
      }
    );
    await writeAsyncIterableToWritable(iterableData, uploadStream);
  });

  return uploadPromise as Promise<cloudinary.UploadApiResponse | null>;
}

export async function uploadImages(
  files: File[],
  preset: UPLOAD_PRESET_ENUM = UPLOAD_PRESET_ENUM.bidhubItem
) {
  if (!files || !files.length) return [];

  const uploadPromises = files.map(async (file) => {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    const iterableData = createAsyncIterable(data);

    return new Promise<cloudinary.UploadApiResponse | null>(
      async (resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "bidhub",
            upload_preset: preset,
          },
          (error, result) => {
            if (error) {
              console.error("error", error);
              resolve(null);
              return;
            }
            resolve(result || null);
          }
        );

        try {
          await writeAsyncIterableToWritable(iterableData, uploadStream);
        } catch (err) {
          console.error("Error writing to upload stream:", err);
          resolve(null);
        }
      }
    );
  });

  return Promise.all(uploadPromises);
}
