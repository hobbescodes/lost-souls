import Image from "next/image";
import Navigation from "./Navigation";

function Header() {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between space-y-4 bg-black lg:flex-row lg:space-y-0 lg:space-x-4">
      <div className="m-4 flex h-auto flex-col items-center justify-between sm:flex-row">
        <div className="flex items-center justify-center space-x-4">
          <Image
            className="rounded-full"
            src="https://pbs.twimg.com/profile_images/1472478237548851204/SOZnLpqj_400x400.jpg"
            width={75}
            height={75}
          />
          <p className="font-header-font hidden text-3xl md:inline-flex">
            Lost Souls Rarity
          </p>
        </div>
      </div>

      <div className="md:ml-20">
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
