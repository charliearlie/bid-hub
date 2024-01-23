import type { Category } from "@prisma/client";
import { Link } from "@remix-run/react";

type Props = {
  categories: Pick<Category, "name" | "slug">[];
};

export function CategoryList({ categories }: Props) {
  return (
    <div className="sticky top-[82px] z-40 hidden bg-accent-foreground sm:block dark:bg-background">
      <ul className="mx-auto flex max-w-screen-xl items-center justify-center space-x-8 overflow-x-auto px-4 py-3 md:px-8">
        {categories.map((category, idx) => (
          <li
            key={idx}
            className="text-xl font-bold text-gray-300 hover:text-gray-400"
          >
            <Link to={category.slug}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
