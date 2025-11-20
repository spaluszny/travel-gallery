//import Image from "next/image";
import SideBar from "@/components/sidebar";
export default function Home() {
  return (
    <div className="">
    <meta name="theme-color" content="#F5F5F5"/>
    <div className="static md:hidden"><SideBar />
    </div>
    <div className="pl-20 pt-10">
      {/* <SideBar /> */}
      <h2>RECENT</h2>
      <p className="w-3/5">Photos from my most recent adventure. I had the amazing opportunity to complete the Manaslu Circuit in Nepal. </p>
    </div>
    </div>
  );
}
