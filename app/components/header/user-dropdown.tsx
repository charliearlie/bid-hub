import { User } from "@prisma/client";
import { Link } from "@remix-run/react";
import { useState } from "react";

type Props = {
  className: string;
  user: User | null;
};
export default function UserDropDown({ className, user }: Props) {
  const [state, setState] = useState<boolean>(false);

  if (!user) {
    return (
      <div className={className}>
        <Link to="/login" className={`button button-primary w-20 lg:block`}>
          Log in
        </Link>
      </div>
    );
  }

  const navigation = [
    { title: "Dashboard", path: "/user/dashboard" },
    { title: "Settings", path: "/user/settings" },
    { title: "Log out", path: "/user/logout" },
  ];

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-4">
        <button
          className="h-10 w-10 rounded-full outline-none ring-2 ring-white ring-offset-2 lg:focus:ring-violet-500"
          onClick={() => setState(!state)}
        >
          <img
            src="https://ih1.redbubble.net/image.1003426384.0291/st,small,507x507-pad,600x600,f8f8f8.jpg"
            className="h-full w-full rounded-full"
          />
        </button>
        <div className="lg:hidden">
          <span className="block">{user.username}</span>
          <span className="block text-sm text-gray-500">{user.email}</span>
        </div>
      </div>
      <ul
        className={`top-12 right-0 mt-5 space-y-5 bg-gray-800 lg:absolute lg:mt-0 lg:w-52 lg:space-y-0 lg:rounded-md lg:border lg:bg-white lg:text-sm lg:shadow-md ${
          state ? "" : "lg:hidden"
        }`}
      >
        {navigation.map((item, idx) => (
          <li key={idx}>
            <a
              className="block text-gray-300 lg:p-2.5 lg:hover:bg-gray-50"
              href={item.path}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
