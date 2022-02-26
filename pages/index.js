import Head from "next/head";
import Header from "../components/Header";
import Results from "../components/Results";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center space-y-4 overflow-scroll scroll-smooth bg-black text-white">
      <div className="my-4 space-y-2">
        <Head>
          <title>Lost Souls Rarity</title>
          <meta
            name="description"
            content="Rarity Ranker designed for Lost Souls Sanctuary"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <div className="mb-1">
          <Results />
        </div>
      </div>
    </div>
  );
}
