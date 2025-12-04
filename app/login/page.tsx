//'use client'

import googleAuth from "@/components/googleAuth"

export default async function Home() {

    const data = await googleAuth()
    const url = data.config.url

    return (
        <div className="p-8">
            <h1 className="text-xl pb-1 text-gray-600">Google Photos Picker API Example</h1>
            {/* <button onClick={handleGoogleLogin}>
                Sign in with Google
            </button> */}
            <div className="flex p-8 pt-12 pb-12 border rounded-xl border-gray-200">
                <div className="flex-1 min-w-96  mr-12">
                    <span id="naming_device" >
                        <h1 className="text-2xl font-medium mb-4">Creating device...</h1>
                    </span>
                    <span id="name_device">
                        <h1 className="text-2xl font-medium mb-4">Connect to Google Photos</h1>

                        <a className="p-4 px-8 border border-gray-400 rounded-xl inline-block hover:bg-blue-50 cursor-pointer hover:border-blue-400" id="google_photos_button" href="/auth/google">
                            <div className="inline-block mr-4">
                                <img src="photos_36dp.png" alt="Google Photos Logo" className="w-100" />
                            </div>
                            <div className="inline-block">
                                <h2 className='text-lg font-semibold'>Google Photos</h2>
                                <p className="text-md">Pick images and videos from your library</p>
                            </div>
                        </a>

                    </span>

                </div>

            </div>

        </div>
    )
}