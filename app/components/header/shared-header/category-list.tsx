import { Link } from "@remix-run/react";
import type { Category } from "@prisma/client";

type Props = {
    categories: Pick<Category, "name" | "slug">[];
};

export function CategoryList({ categories }: Props) {
    return (
        <div className="bg-accent-foreground dark:bg-background">
            <ul className="mx-auto flex justify-center items-center max-w-screen-xl space-x-8 py-3 px-4 md:px-8">
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
