import { Link } from "@remix-run/react";
import { useState } from "react";
import type { UserType as User } from "~/types";

import type { Category } from "@prisma/client";
import { Account } from "./account";
import { Search } from "./search";
import { Menu } from "./menu";

import { cn } from "~/util/utils";
import { CategoryList } from "./category-list";

type Props = {
  user: User | null;
  isHomepage: boolean;
  categories: Pick<Category, "name" | "slug">[];
};

export function SharedHeader({ user, isHomepage, categories }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const classy = cn(
    'sticky top-0 z-50 bg-accent-foreground dark:bg-background sm:h-[84px]',
    isHomepage &&  'h-4/5 sm:h-[100%]'
  );
  const layoutClass = cn(
    'mx-auto flex max-w-screen-xl items-center space-x-8 py-3 px-4 md:px-8',
    isHomepage &&  'flex-col space-y-8'
  );

  const test = cn(isHomepage ? "order-first w-full flex space-between" : "w-full flex space-x-8 items-center")

  const logo = cn(
    "text-2xl font-black text-purple-200 md:text-4xl",
    isHomepage && 'text-4xl md:text-8xl'
  )

  const t = cn(isHomepage && "w-full")

  return (
    <>
      <nav className={classy}>
        <div className={layoutClass}>
          <div className="flex-none lg:flex-initial">
            <Link to="/">
              <span className={logo}>
                Bidhub
              </span>
            </Link>
          </div>
          { isHomepage && <p className="text-xl font-bold text-gray-300">An eCommerce website built on a modern tech stack</p> }
          {/* <div className="flex flex-1 space-x-6 items-center justify-between"> */}
          <div className={test}>

          <Menu user={user} isMenuOpen={isMenuOpen} className={t} />
            {!isHomepage && <Search  />}
          <Account user={user} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
          {isHomepage && <Search />}

        </div>
      </nav>
      <CategoryList categories={categories} />
    </>
  );
}
