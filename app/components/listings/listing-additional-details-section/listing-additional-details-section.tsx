import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/common/ui/accordion";

export const ListingAdditionalDetailsSection = () => {
  return (
    <section aria-labelledby="details-heading" className="mt-12">
      <h2 id="details-heading" className="sr-only">
        Additional details
      </h2>

      <div className="divide-y divide-gray-200 border-t">
        {[1, 2, 3, 4].map((num) => (
          <Accordion key={num} type="single" collapsible>
            <AccordionItem value={String(num)}>
              <AccordionTrigger>Features</AccordionTrigger>
              <AccordionContent>
                This item has no features. it's shite
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
};
