import { NavLink, NavLinkProps } from "@remix-run/react";
import React, { HTMLAttributes } from "react";

type TabNavLinkProps = NavLinkProps & HTMLAttributes<HTMLAnchorElement>;

export const TabNavLink = React.forwardRef<HTMLAnchorElement, TabNavLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <NavLink
        className={({ isActive }) =>
          `inline-flex items-center justify-center whitespace-nowrap p-3 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
            isActive ? "bg-accent" : ""
          }`
        }
        ref={ref}
        {...props}
      >
        {children}
      </NavLink>
    );
  }
);
