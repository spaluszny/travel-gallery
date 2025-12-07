//'use client'
import oauth2Client from "@/utils/google-auth"
import Link from "next/link"


export default function Home() {
    const SCOPE = ("https://www.googleapis.com/auth/photospicker.mediaitems.readonly")
    const authorziationURL = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPE,
        prompt: 'consent'
    })

    return (

        <div className="p-10 text-center">
            <p className="text-2xl font-bold">Welcome to My Super Secret Login Page</p>
            <p className="font-bold">NOW SCRAM...</p>
            <p className="font-bold">Unless you are Sarah </p>
            <p className="font">If you&apos;re Sarah then, </p>
            <p>Heyyyyyy girl🥰. You look extra cute today ;)</p>

            <Link href={authorziationURL}>

                <button className="px-3 py-2 mt-5 bg-black text-white rounded-md w-1/4 cursor-pointer">Login To Google</button>

            </Link>
        </div>
    )
}

//https://www.googleapis.com/auth/photospicker.mediaitems.readonly
//https://www.googleapis.com/auth/photoslibrary.readonly