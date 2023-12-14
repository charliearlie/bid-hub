import type { NavLinkProps } from "@remix-run/react";
import { NavLink } from "@remix-run/react";
import type { HTMLAttributes } from "react";
import React from "react";

import { cn } from "~/util/utils";

type TabNavLinkProps = NavLinkProps & HTMLAttributes<HTMLAnchorElement>;

export const TabNavLink = React.forwardRef<HTMLAnchorElement, TabNavLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <NavLink
        className={({ isActive }) =>
          cn(
            "inline-flex items-center justify-center whitespace-nowrap bg-accent p-3 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            className,
            isActive ? "bg-primary font-bold text-primary-foreground" : ""
          )
        }
        ref={ref}
        {...props}
      >
        {children}
      </NavLink>
    );
  }
);

TabNavLink.displayName = "TabNavLink";
