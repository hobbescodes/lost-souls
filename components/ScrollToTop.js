import Link from "next/link";
import { ArrowSmUpIcon } from "@heroicons/react/solid";

function ScrollToTop() {
  return (
    <div className="fixed bottom-4 right-5">
      <div className="relative transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer">
        <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-[#14aed0] to-[#6a3fe4] blur-lg"></div>
        <Link href="#top">
          <a className="relative inline-flex items-center rounded-full bg-black">
            <ArrowSmUpIcon className="h-8 w-8" />
          </a>
        </Link>
      </div>
    </div>
  );
}

export default ScrollToTop;
