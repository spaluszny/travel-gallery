
// import oauth2Client from "@/utils/google-auth"
import { cookies } from "next/headers"
// import { google } from "googleapis"
import PhotoPicker from "@/components/photoPicker"

export default async function Home() {
    const cookieStore = cookies()
    const accessToken = (await cookieStore).get("google_access_token")?.value

    if (!accessToken) {
    return (
      <div className="p-10">
        <h1>Not logged in</h1>
        <p>Please log in first</p>
      </div>
    )
  }

    return (
        <div className="p-10">
            <h1>You are Logged In</h1>
            <p>Select the photos you want to add</p>
            <PhotoPicker accessToken={accessToken}
                apiKey={process.env.API_KEY || ''} />

        </div>
    )
}