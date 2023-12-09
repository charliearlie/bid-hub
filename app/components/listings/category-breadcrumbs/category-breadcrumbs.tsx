import type { Category, Listing } from "@prisma/client";
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
      <ol className="flex items-center justify-center space-x-4 sm:justify-start">
        {parentCategory && (
          <CategoryBreadcrumb
            id={parentCategory.id}
            name={parentCategory.name}
            slug={parentCategory.slug}
            isParent
          />
        )}
        <CategoryBreadcrumb
          id={category.id}
          name={category.name}
          slug={category.slug}
        />
        <li className="text-sm">
          <Link
            to={slug}
            aria-current="page"
            className="font-medium opacity-60 hover:opacity-100"
          >
            {title}
          </Link>
        </li>
      </ol>
    </nav>
  );
};

type CategoryBreadcrumbProps = {
  id: string;
  isParent?: boolean;
  name: string;
  slug: string;
};

const CategoryBreadcrumb = ({
  id,
  isParent,
  name,
  slug,
}: CategoryBreadcrumbProps) => {
  return (
    <li key={id} className={isParent ? "hidden sm:block" : ""}>
      <div className="flex items-center">
        <Link
          to={`../categories/${slug}`}
          className="mr-4 text-sm font-semibold hover:opacity-80"
        >
          {name}
        </Link>
        <SlashIcon className="text-accent" />
      </div>
    </li>
  );
};
