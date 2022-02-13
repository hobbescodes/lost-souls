import Image from "next/image";

function Header() {
  return (
    <div className="flex w-full justify-center bg-black">
      <header className="m-4 flex h-auto flex-col items-center justify-between sm:flex-row">
        <div className="flex items-center justify-center space-x-4">
          <Image
            className="rounded-full"
            src="https://pbs.twimg.com/profile_images/1472478237548851204/SOZnLpqj_400x400.jpg"
            width={100}
            height={100}
          />
          <p className="font-header-font text-3xl">Lost Souls Rarity</p>
        </div>
      </header>
    </div>
  );
}

export default Header;
