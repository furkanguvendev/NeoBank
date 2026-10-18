import { Fragment } from "react";
import type { IconType } from "react-icons";
import logo from "../assets/logo.png";
import logok from "../assets/logok.png";
import { HiHome } from "react-icons/hi";
import { BsInfoSquareFill } from "react-icons/bs";
import { FaPhoneSquareAlt } from "react-icons/fa";
import "./Header.css";

interface HeaderProps {
  onClick: (url: string) => void;
}

const links: { label: string; url: string; Icon: IconType }[] = [
  { label: "Ana Sayfa", url: "/", Icon: HiHome },
  { label: "Hakkımda", url: "/aboutme", Icon: BsInfoSquareFill },
];

const MAIL = "mailto:furkanguven.dev@gmail.com";

export const Header: React.FC<HeaderProps> = ({ onClick }) => {
  return (
    <div className="flex flex-row py-4 lg:py-10 items-center w-[92%] max-w-6xl justify-between">
      <img className="hidden lg:block" src={logo} alt="Cashkon" />
      <img className="block lg:hidden scale-50 origin-left" src={logok} alt="Cashkon" />
      <nav className="flex flex-row gap-5 lg:gap-10 items-center">
        {links.map(({ label, url, Icon }) => (
          <Fragment key={url}>
            <button type="button" className="navigation" onClick={() => onClick(url)}>
              {label}
            </button>
            <button
              type="button"
              aria-label={label}
              className="icon text-3xl"
              onClick={() => onClick(url)}
            >
              <Icon />
            </button>
          </Fragment>
        ))}
        <a className="navigation" href={MAIL}>İletişim</a>
        <a className="icon text-3xl" aria-label="İletişim" href={MAIL}>
          <FaPhoneSquareAlt />
        </a>
      </nav>
    </div>
  );
};