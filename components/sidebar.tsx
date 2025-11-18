import Link from "next/link";


export default function SideBar() {
    return (

        <div className="h-screen w-100 bg-[#F5F5F5] p-10 fixed">
            <div>
                <h2>Sarah Paluszny</h2>
                <h3 className="-mt-2">Travel Photography</h3>
                <p className="pt-5">This is a collection of photographs, I’ve attained while traveling the world. Some are taken by me. Some are taken by friends I’ve met along the way. Hope you enjoy :)</p>
            </div>
            <div className="pt-20">
                <h4 className="font-bold">The Gallery</h4>
                <ul className="flex flex-col gap-1 text-md">
                    <li className="underline hover:text-gray-600"><Link href="/north-america">North America</Link></li>
                    <li className="underline hover:text-gray-600"><Link href="/asia">Asia</Link></li>
                    <li className="underline hover:text-gray-600"><Link href="/europe">Europe</Link></li>
                    <li className="underline hover:text-gray-600"><Link href="/africa">Africa</Link></li>
                </ul>
            </div>

        </div>


    )
}