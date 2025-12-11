//import Image from "next/image";
import SideBar from "@/components/sidebar";
import AlbumFetcher from "@/components/fetchPhotos";
import DatabasePhotos from "@/components/databasePhotos";
export default function Home() {

  return (
    <div className="">
    <meta name="theme-color" content="#F5F5F5"/>
    <div className="static md:hidden"><SideBar />
    </div>
    <div className=" p-5 md:p-10">
      {/* <SideBar /> */}
      <h2>RECENT</h2>
      <p className="sm:w-3/5 pb-5">Photos from my most recent adventure. I had the amazing opportunity to complete the Manaslu Circuit in Nepal. </p>
      <DatabasePhotos limit={10} />˝
    </div>
    </div>
  );
}
