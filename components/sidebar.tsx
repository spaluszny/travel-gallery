import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Icons } from "./icons"
import Login from "./login";
import LoginDialog from "./loginDialog";


export default function SideBar() {
    return (

        <div className="h-screen md:w-100 bg-[#F5F5F5]  md:fixed">
                <Login>
                    <LoginDialog />
                </Login>
            <div className="px-10">


                <div>
                    <h2 className="">Sarah Paluszny</h2>
                    <h3 className="-mt-2">Travel Photography</h3>
                    <p className="pt-5">This is a curated collection of photographs obtained during my travels around the world. Most of the images were taken by me; some were taken by friends I have met along the way. I hope you enjoy :&#41;</p>
                </div>
                <div className="pt-10 text-lg font-semibold uppercase"><Link href="/">Recent</Link></div>
                <div className="pt-10">
                    <h4 className="font-bold uppercase">The Gallery</h4>
                    <ul className="flex flex-col gap-1 text-md">
                        {/* <li className="underline hover:text-gray-600"><Link href="/">Recent</Link></li> */}
                        <li className="underline uppercase hover:text-gray-600"><Link href="/asia">Asia</Link></li>
                        <li className="underline uppercase hover:text-gray-600"><Link href="/north-america">North America</Link></li>
                        <li className="underline uppercase hover:text-gray-600"><Link href="/europe">Europe</Link></li>
                        <li className="underline uppercase hover:text-gray-600"><Link href="/africa">Africa</Link></li>
                    </ul>
                </div>
                <div className="absolute bottom-10 right-10">
                    <div className="flex gap-5">
                        <Link href={`mailto:${siteConfig.links.email}`} target="blank" rel="noreferrer">
                            <Icons.email className="h-6 w-6 transform transition duration-300 hover:scale-120" />
                            <span className="sr-only">Email</span>
                        </Link>
                        <Link href={siteConfig.links.github} target="blank" rel="noreferrer">
                            <Icons.gitHub className="h-6 w-6 transform transition duration-300 hover:scale-120" />
                            <span className="sr-only">Github</span>
                        </Link>
                        <Link href={siteConfig.links.website} target="blank" rel="noreferrer">
                            <Icons.website className="h-6 w-6 transform transition duration-300 hover:scale-120" />
                            <span className="sr-only">Personal Website</span>
                        </Link>

                    </div>
                </div>
            </div>
        </div>


    )
}