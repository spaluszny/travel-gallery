import Image from "next/image"

export default function Home() {
    const londonX = 151.5
    const londonY = 127

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="relative border-2">
                <Image
                    src="/world-map.png"
                    alt="world map"
                    width={1000}
                    height={500}
                    className="max-w-full h-auto"
                />

                <span
                    className="absolute text-xl"
                    style={{
                        left: `${londonX}px`,
                        top: `${londonY}px`,
                    }}>📍</span>
            </div>
        </div>
    )
}
