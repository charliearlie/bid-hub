import { useState } from "react";
import { Link } from "@remix-run/react";

function SharedHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 py-4">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Link to="/">
              <img className="h-8" src="" alt="Logo" />
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              className="text-gray-500 hover:text-white focus:text-white focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="4"
                  y="11"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="4"
                  y="17"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div className="hidden md:flex md:items-center">
            <ul className="md:flex md:space-x-4">
              <li>
                <Link
                  className="py-2 px-4 text-gray-300 hover:text-white"
                  to="/about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="py-2 px-4 text-gray-300 hover:text-white"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className={`${
          isOpen ? "" : "hidden"
        } space-y-1 px-2 pt-2 pb-3 md:hidden`}
      >
        <Link
          className="block py-2 px-4 text-gray-300 hover:text-white"
          to="/about"
        >
          About
        </Link>
        <Link
          className="block py-2 px-4 text-gray-300 hover:text-white"
          to="/contact"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}

export default SharedHeader;
