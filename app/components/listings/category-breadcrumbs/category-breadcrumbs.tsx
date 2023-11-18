import { Category, Listing } from "@prisma/client";
import { Link } from "@remix-run/react";
import { SlashIcon } from "lucide-react";

type Props = {
  category: Pick<Category, "id" | "name" | "slug"> & {
    parentCategory?: Category;
  };
  listing: Pick<Listing, "title" | "slug">;
};

export const CategoryBreadcrumbs = ({
  category,
  listing: { slug, title },
}: Props) => {
  const { parentCategory } = category;
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl pb-8">
      <ol role="list" className="flex items-center space-x-4">
        {parentCategory && (
          <li key={parentCategory.id}>
            <div className="flex items-center">
              <Link
                to={`../categories/${parentCategory.slug}`}
                className="mr-4 text-sm font-semibold"
              >
                {parentCategory.name}
              </Link>
              <SlashIcon className="text-accent" />
            </div>
          </li>
        )}
        <li key={category.id}>
          <div className="flex items-center">
            <Link
              to={`../categories/${category.slug}`}
              className="mr-4 text-sm font-semibold"
            >
              {category.name}
            </Link>
            <SlashIcon className="text-accent" />
          </div>
        </li>
        <li className="text-sm">
          <Link
            to={slug}
            aria-current="page"
            className="font-medium opacity-60"
          >
            {title}
          </Link>
        </li>
      </ol>
    </nav>
  );
};
