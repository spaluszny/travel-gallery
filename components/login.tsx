'use client'
//import oauth2Client from "@/utils/google-auth"
import Link from "next/link"
import { ReactNode, useState, isValidElement, cloneElement } from "react"
import LoginDialog from "./loginDialog"


export default function Login( {children}: { children: ReactNode }) {


    const [openLogin, setOpenLogin] = useState(false)

    const toggleLogin = () => {
        setOpenLogin(!openLogin)
    }

    return (

        <div className="">

            <div
                className={`fixed inset-0 transition-all duration-500 z-30 ${openLogin ? 'backdrop-blur-lg pointer-events-auto' : 'backdrop-blur-none pointer-events-none'
                    }`}
            />
            <button
                onClick={toggleLogin}
                className="relative right-0 top-0 h-10 w-10 cursor-pointer z-50"
            >
                {/* {openLogin ? '' : ''} */}
            </button>

            {openLogin && (
                <div className={`fixed inset-0 z-40 flex items-center justify-center ease-in transition-all duration-1000 p-4 ${openLogin ? 'opacity-90' : 'opacity-0'}`}>
                    {isValidElement(children) 
                        ? cloneElement(children, { onClose: toggleLogin } as any)
                        : children
                    }
                </div>
            )}
        </div>
    )
}
