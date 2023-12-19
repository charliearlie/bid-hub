import { Link } from "@remix-run/react";
import { useState } from "react";
import type { UserType as User } from "~/types";

import type { Category } from "@prisma/client";
import { Account } from "./account";
import { Search } from "./search";
import { Menu } from "./menu";

import { cn } from "~/util/utils";
import { CategoryList } from "./category-list";

import useScrollPosition from "../../../hooks/useScrollPosition";
import useWindowWidth from "../../../hooks/useScreenWidth";

import type { UserType as User } from "~/types";

type Props = {
  user: User | null;
  isHomepage: boolean;
  categories: Pick<Category, "name" | "slug">[];
};

type LogoProps = {
  isFullSize?: Boolean;
};

function Logo({ isFullSize }: LogoProps) {
  return (
    <div className="flex-none lg:flex-initial">
      <Link to="/">
        <span className={`font-black text-purple-200 ${isFullSize ? 'text-9xl' : 'md:text-4xl text-2xl'}`}>
          Bidhub
        </span>
      </Link>
    </div>
  )
}

export function SharedHeader({ user, isHomepage, categories }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const scrollPosition = useScrollPosition();
  const windowWidth = useWindowWidth();

  const checkHeight = (item: 'logo' | 'search') => {
    const items = {
      logo: {
        sm: 270,
        lg: 235
      },
      search : {
        sm: 537,
        lg: 500
      }
    }

    const itemSize = items[item]
    const minHeigth = windowWidth ? itemSize[windowWidth] : itemSize.lg

    return minHeigth < scrollPosition;
  }

  const shouldShowHeroItems = {
    logo: (isHomepage && checkHeight('logo')) || !isHomepage || isMenuOpen,
    search:( isHomepage && checkHeight('search')) || !isHomepage,
  };

  const navigationClass = 'mx-auto flex max-w-screen-xl items-center gap-8 py-3 px-4 md:px-8'

  const navigationContainerClass = cn(
    "flex gap-8 justify-between items-center ",
    shouldShowHeroItems.logo && 'lg:w-full',
    shouldShowHeroItems.search && 'w-full'
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-accent-foreground dark:bg-background ">
        <div className={cn(navigationClass, shouldShowHeroItems.logo ? 'justify-between' : 'justify-end')}>
            { shouldShowHeroItems.logo  && <Logo /> }
          <div className={navigationContainerClass}>
            <Menu user={user} isMenuOpen={isMenuOpen} className={(!shouldShowHeroItems.search || isMenuOpen ) ? "w-full" : ''} />
              {shouldShowHeroItems.search && <Search  />}
              <Account user={user} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            </div>
        </div>
      </nav>
      { isHomepage && 
        <div className="bg-accent-foreground dark:bg-background">
          <div className={cn(navigationClass, isHomepage && 'flex-col space-y-10 pt-32 pb-24' )}>
            <Logo isFullSize />
            <p className="text-xl font-bold text-gray-300">An eCommerce website built on a modern tech stack</p>
            <Search />
          </div>
        </div>
      }
      <CategoryList categories={categories}/>
    </>
  );
}
