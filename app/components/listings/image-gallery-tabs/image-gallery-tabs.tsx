import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/common/ui/tabs";

import { cn } from "~/util/utils";

type Props = {
  images: string[]; // We're going to create new image type to incorporate alt text
  listingTitle: string;
};
export const ImageGalleryTabs = ({ images, listingTitle }: Props) => {
  return (
    <Tabs defaultValue={images[0]}>
      {images.map((image, index) => (
        <TabsContent key={image} value={image}>
          <img
            className="h-[300px] w-full rounded-lg object-cover sm:h-[500px]"
            src={image}
            alt={`${listingTitle}-image-${index}`}
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
          <TabsTrigger className="p-0" key={image} value={image}>
            <img
              className="h-20 w-20 rounded-lg object-cover"
              src={image}
              alt={`${listingTitle}-image-${index}`}
            />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
