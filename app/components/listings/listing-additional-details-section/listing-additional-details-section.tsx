import type { FulfilmentOption, ProductDetails } from "@prisma/client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/common/ui/accordion";

import { FulfilmentOptions } from "../fulfilment-options/fulfilment-options";
import { ProductDetails as ProductDetailsComponent } from "../product-details/product-details";

type Props = {
  fulfilmentOptions: Pick<
    FulfilmentOption,
    "minDays" | "maxDays" | "method" | "price"
  >[];
  productDetails: Partial<ProductDetails> | null;
};

export const ListingAdditionalDetailsSection = ({
  productDetails,
  fulfilmentOptions,
}: Props) => {
  return (
    <section aria-labelledby="details-heading" className="mt-12">
      <h2 id="details-heading" className="sr-only">
        Additional details
      </h2>

      <div className="divide-y divide-gray-200 border-t">
        {productDetails && Object.keys(productDetails).length !== 0 && (
          <Accordion defaultValue="productDetails" type="single" collapsible>
            <AccordionItem value="productDetails">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent>
                <ProductDetailsComponent options={productDetails} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        <Accordion type="single" collapsible>
          <AccordionItem value="fulfilmentOptions">
            <AccordionTrigger>Delivery options</AccordionTrigger>
            <AccordionContent>
              <FulfilmentOptions options={fulfilmentOptions} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="warrantyAndInsurance">
            <AccordionTrigger>Warranty & Insurance</AccordionTrigger>
            <AccordionContent>
              This item doesn't have a warranty and if you want insurance then
              you need to pay us the big bucks
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};
