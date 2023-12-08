import { Link } from "@remix-run/react";
import type { UserType as User } from "~/types";

import { UserDropDown } from "~/components/header/user-dropdown";
import { cn } from "~/util/utils";

type Props = {
  user: User | null;
  isMenuOpen: boolean;
} & React.HTMLAttributes<HTMLDivElement>; 

export function Menu({ user, isMenuOpen, className }: Props ) {
  const navigation = [
    { title: "Buy", path: "/buy" },
    { title: "Sell", path: "/listings/create" },
  ];

  return (
    <div
      className={cn(
        `border-bp-4 absolute top-16 left-0 z-20 lg:static lg:block lg:border-none bg-accent-foreground dark:bg-background`,
        !isMenuOpen && "hidden",
        className
      )}
      >
      <ul className="mt-12 space-y-5 lg:mt-0 lg:flex lg:space-x-6 lg:space-y-0">
        {navigation.map((item, idx) => (
          <li
            key={idx}
            className="text-xl font-bold text-gray-300 hover:text-gray-400"
          >
            <Link to={item.path}>{item.title}</Link>
          </li>
        ))}
      </ul>

      <UserDropDown
        className="mt-5 block border-t bg-gray-800 pt-5 lg:hidden"
        user={user}
      />
    </div>
  );
}
