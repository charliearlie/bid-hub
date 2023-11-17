import { UploadCloud } from "lucide-react";
import React, { useId } from "react";

import { Label } from "~/components/common/ui/label";

enum UPLOAD_PRESET_ENUM {
  bidhubAvatar = "bidhub_avatar",
  bidhubItem = "bidhub_item",
}

type ImageUploadProps = {
  uploadPreset?: UPLOAD_PRESET_ENUM;
};

type Props = ImageUploadProps & React.HTMLProps<HTMLInputElement>;

export const ImageUpload = React.forwardRef<HTMLInputElement, Props>(
  ({ uploadPreset = UPLOAD_PRESET_ENUM.bidhubItem, ...props }, ref) => {
    const id = useId();
    return (
      <div className="border-text-foreground flex min-h-[200px] flex-col items-center justify-between rounded-md border-2 border-dashed border-accent bg-input">
        <Label
          htmlFor={id}
          className="flex h-full w-full flex-col items-center justify-center font-bold"
        >
          <div className="flex flex-col items-center gap-2">
            <UploadCloud size={64} />
            <p>
              Click to <strong>upload</strong> or drag and drop
            </p>
            <p className="font-light">SVG, PNG, JPG or GIF</p>
          </div>
        </Label>
        <input className="hidden" type="file" id={id} ref={ref} {...props} />
        {/* <div className="self-start">
          <img height={50} width={50} src="https://picsum.photos/200" />
        </div> */}
      </div>
    );
  }
);
