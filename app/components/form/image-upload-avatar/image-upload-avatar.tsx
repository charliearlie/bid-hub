import { FieldConfig } from "@conform-to/react";
import { PlusIcon } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { z } from "zod";

import { FileSchema } from "~/services/zod-schemas";

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
          {...fieldProps}
          onChange={async (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setPreviewImage(reader.result as string);
              };
              reader.readAsDataURL(file);
            } else {
              setPreviewImage(null);
            }
          }}
        />
      </label>
    </>
  );
});

ImageUploadAvatar.displayName = "ImageUploadAvatar";
