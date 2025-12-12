

export default function Newsletter() {



    return (
        <div className="flex flex-col justify-center items-center p-10">
            <p className="font-bold">Join the Newsletter</p>
            <p>Get notifications when new photos are posted!</p>
            <div className="flex gap-2 pt-5">
            <input
                type="email"
                placeholder="Email"
                className="border p-2 w-100"
            />
            <button className="bg-black text-white px-5 font-bold hover:opacity-80 ">JOIN</button>
            </div>
        </div>
    )
}