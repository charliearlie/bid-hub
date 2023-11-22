import { CoreImageType } from "~/types";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/common/ui/tabs";

import { cn } from "~/util/utils";

type Props = {
  images: CoreImageType[]; // We're going to create new image type to incorporate alt text
  listingTitle: string;
};
export const ImageGalleryTabs = ({ images, listingTitle }: Props) => {
  return (
    <Tabs defaultValue={images[0].publicId}>
      {images.map((image, index) => (
        <TabsContent key={image.publicId} value={image.publicId}>
          <img
            className="h-[300px] w-full rounded-lg object-cover sm:h-[500px]"
            src={image.imageUrl}
            alt={`${listingTitle}-image-${index}`}
            loading="eager"
          />
        </TabsContent>
      ))}
      <TabsList
        className={cn(
          `mt-4 flex h-20 justify-start gap-2 bg-background`,
          images.length === 1 && "hidden"
        )}
      >
        {images.map((image, index) => (
          <TabsTrigger
            className="p-0"
            key={image.publicId}
            value={image.publicId}
          >
            <img
              className="h-20 w-20 rounded-lg object-cover"
              src={image.imageUrl}
              alt={`${listingTitle}-image-${index}`}
              loading="lazy"
            />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
