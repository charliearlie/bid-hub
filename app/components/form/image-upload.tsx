import React, { useId } from "react";
import { Label } from "../common/ui/label";
import { UploadCloud } from "lucide-react";

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
        <div className="self-start">
          <img height={50} width={50} src="https://picsum.photos/200" />
        </div>
      </div>
    );
  }
);

// export default function ImageUpload({
//   uploadPreset = UPLOAD_PRESET_ENUM.bidhubItem,
//   ...props
// }: Props) {
//   return (
//     <input
//       type="file"
//       onChange={uploadImage}
//       {...props}
//     />
//   );
// }

// file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200
