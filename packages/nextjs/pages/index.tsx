import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Listings } from "~~/components/Listings";
import Earnings from "~~/components/Earnings";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ListItem from "~~/components/forms/ListItem";


const Home: NextPage = () => {
  const [showListItem, setShowListItem] = useState(false)

  const toggleListItem = () => {
    setShowListItem(current => !current)
  }
  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>


      <div className="flex flex-wrap gap-5 items-center justify-between px-5 py-3 border-b border-white/30">
        <div className="flex items-center space-x-4">
          <Earnings name="Earnings" items={[{owner: "", address:""}]} onWithdraw={() => console.log("Withdraw...")} />
          <Earnings name="Fees" items={[{owner: "", address:""}]} onWithdraw={() => console.log("Withdraw...")} />
        </div>

        <div className="space-x-4">
          <button className="bg-green-500 hover:bg-black transition-colors duration-300 text-white font-bold rounded-lg px-4 py-1 text-lg">My Items</button>
          <button className="bg-green-500 hover:bg-black transition-colors duration-300 text-white font-bold rounded-lg px-4 py-1 text-lg" onClick={toggleListItem}>List Item</button>
        </div>
      </div>

      <Listings />

      {/* Modals */}

      <ListItem isOpen={showListItem} toggleVisibility={toggleListItem} />
      
    </>
  );
};

export default Home;
