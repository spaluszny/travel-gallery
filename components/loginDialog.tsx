
import oauth2Client from "@/utils/google-auth"
import Link from "next/link"


export default function LoginDialog({ onClose }: { onClose?: () => void }) {
    const SCOPE = ("https://www.googleapis.com/auth/photospicker.mediaitems.readonly")
    const authorziationURL = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPE,
        prompt: 'consent'
    })

    return (

        <div className="p-10 absolute  text-center bg-[#1E1E1E] gap-2 text-white rounded-2xl md:w-150 w-100">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 h-5 w-5 cursor-pointer text-white hover:text-gray-300 text-10xl"
                >
                    ×
                </button>
            )}
            <div className="flex items-center flex-col">
                <h2>Log In</h2>
                <p>Welcome, to my super secret log in page. If you are not Sarah Paluszny, please leave at once.</p>
                <div className="flex flex-col py-5">
                    <input
                        type="text"
                        placeholder="Username"
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        className="border p-2 mb-2 w-full"
                    />
                </div>
                <Link href={authorziationURL}>
                    <button className="btn-primary">Login To Google</button>
                </Link>
            </div>
        </div>
    )
}
