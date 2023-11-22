import { writeAsyncIterableToWritable } from "@remix-run/node";
import cloudinary from "cloudinary";

import { CoreImageType } from "../types";

export enum UPLOAD_PRESET_ENUM {
  bidhubAvatar = "bidhub_user_avatar",
  bidhubItem = "bidhub_item",
  bidhubListingThumbnail = "bidhub_listing_thumbnail",
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function* createAsyncIterable(data: Uint8Array) {
  yield data;
}

export async function uploadImages(
  files: File | File[],
  preset: UPLOAD_PRESET_ENUM = UPLOAD_PRESET_ENUM.bidhubItem
) {
  const filesArray = Array.isArray(files) ? files : [files]; // Ensure files is an array

  if (!filesArray.length) return [];

  const uploadPromises = filesArray.map(async (file) => {
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

  const results = await Promise.all(uploadPromises);

  return results.length > 0
    ? results
        .filter((result) => Boolean(result))
        .map(
          (result) =>
            ({
              altText: "Will implement",
              imageUrl: result?.secure_url,
              publicId: result?.public_id,
            } as CoreImageType)
        )
    : [];
}

export async function optimiseImageForBrowser(
  image: CoreImageType,
  options: cloudinary.TransformationOptions | cloudinary.ConfigAndUrlOptions = {
    quality: "auto",
    format: "webp",
    fetch_format: "auto",
    secure: true,
    height: 800,
    width: 800,
    crop: "fit",
  }
) {
  const optimisedImage = cloudinary.v2.url(image.publicId, options);

  return { ...image, imageUrl: optimisedImage };
}
