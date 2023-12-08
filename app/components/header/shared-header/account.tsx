import BurgerSVG from "~/styles/svg/burger";
import CloseSVG from "~/styles/svg/close";
import type { UserType as User } from "~/types";

import { UserDropDown } from "~/components/header/user-dropdown";

type Props = {
    user: User | null;
    isMenuOpen: Boolean;
    setIsMenuOpen: (isMenuOpen: boolean) => void
} & React.HTMLProps<HTMLDivElement>;

export function Account({ user, isMenuOpen, setIsMenuOpen, className }: Props) {
    return (
        <div className={className}>
            <UserDropDown className="hidden lg:block" user={user} /> 
            <button
                className="block text-gray-400 outline-none lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <CloseSVG /> : <BurgerSVG />}
            </button>
        </div>
    );
}
