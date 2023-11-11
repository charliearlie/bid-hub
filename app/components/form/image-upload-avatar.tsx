import { FieldConfig } from "@conform-to/react";
import { UploadApiResponse } from "cloudinary";
import { PlusIcon } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { z } from "zod";

import { FileSchema } from "~/services/schemas.server";

import { cn } from "~/util/utils";

export const ImageUploadAvatar = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & {
    fieldProps: FieldConfig<z.infer<typeof FileSchema>>;
  }
>(({ className, fieldProps, src, ...props }, ref) => {
  const [previewImage, setPreviewImage] = useState<string | null>(src || null);
  return (
    <>
      <label aria-label="Change user avatar">
        {previewImage ? (
          <img
            className={cn(
              "cursor-pointer object-cover hover:opacity-80",
              className
            )}
            {...props}
            src={previewImage}
            ref={ref}
          />
        ) : (
          <div
            className={cn(
              "flex cursor-pointer items-center justify-center bg-accent hover:opacity-80",
              className
            )}
          >
            <PlusIcon size={24} />
          </div>
        )}
        <input
          type="file"
          className="sr-only"
          onChange={async (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
              const data = new FormData();
              data.append("file", file);
              data.append("upload_preset", "bidhub_user_avatar");

              const res = await fetch(
                "https://api.cloudinary.com/v1_1/bidhub/image/upload",
                {
                  method: "POST",
                  body: data,
                }
              );

              const image: UploadApiResponse = await res.json();
              if (image.secure_url) {
                setPreviewImage(image.secure_url);
              }
            } else {
              setPreviewImage(null);
            }
          }}
        />
      </label>
      {previewImage && (
        <input type="hidden" {...fieldProps} value={previewImage} />
      )}
    </>
  );
});

ImageUploadAvatar.displayName = "ImageUploadAvatar";
