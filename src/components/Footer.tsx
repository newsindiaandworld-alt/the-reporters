import Link from "next/link";
import Logo from "./Logo";

const LINKS = ["About", "Send a Tip", "Careers", "Terms"];

export default function Footer() {
  return (
    <footer className="bg-white text-slate-500 py-10 px-4 mt-12 border-t border-slate-200 dark:bg-navy-950 dark:text-navy-400 dark:border-navy-800">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo className="h-11 w-auto" />
        <div className="flex flex-row gap-6 text-sm">
          {LINKS.map((link) => (
            <Link
              key={link}
              href="#"
              className="text-slate-500 transition-colors duration-300 ease-out hover:text-slate-900 dark:text-navy-400 dark:hover:text-white"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
