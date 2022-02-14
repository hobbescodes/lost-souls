import Link from "next/link";
import { ArrowSmUpIcon } from "@heroicons/react/solid";

function ScrollToTop() {
  return (
    <div className="fixed bottom-4 right-4">
      <Link href="#top">
        <a className="inline-flex items-center rounded-full border-2 border-white from-[#14aed0] to-[#6a3fe4] p-1 text-white transition-opacity hover:bg-gradient-to-tr">
          <ArrowSmUpIcon className="h-6 w-6" />
        </a>
      </Link>
    </div>
  );
}

export default ScrollToTop;
