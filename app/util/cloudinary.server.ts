import { writeAsyncIterableToWritable } from "@remix-run/node";
import cloudinary from "cloudinary";

enum UPLOAD_PRESET_ENUM {
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
