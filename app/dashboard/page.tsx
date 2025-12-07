
// import oauth2Client from "@/utils/google-auth"
import { cookies } from "next/headers"
// import { google } from "googleapis"
import PhotoPicker from "@/components/photoPicker"
import Link from "next/link"

export default async function Home() {
    const cookieStore = cookies()
    const accessToken = (await cookieStore).get("google_access_token")?.value

    if (!accessToken) {
    return (
      <div className="p-10">
        <h2>Not logged in</h2>
        <h3>Please log in first</h3>
        <button><Link href="/login" /></button>
      </div>
    )
  }

    return (
        <div className="p-10">
            <h2>Welcome, Sarah
            </h2>
            <p>Select the photos you want to add</p>
            <PhotoPicker accessToken={accessToken}
                apiKey={process.env.API_KEY || ''} />

        </div>
    )
}