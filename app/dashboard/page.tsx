
import oauth2Client from "@/utils/google-auth"
import { cookies } from "next/headers"
import { google } from "googleapis"

export default async function Home(){
    const cookieStore = cookies()
    const accessToken = (await cookieStore).get("google_access_token")?.value
    

    return(
        <div className="p-10">
            <h1>You are Logged In :)</h1>
            <p>Select the photos you want to add</p>
            <p>hi {accessToken}</p>
        </div>
    )
}