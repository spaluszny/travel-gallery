"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
//import { ModeToggle } from './modeToggle';

//navbar

// Custom animated hamburger component
const AnimatedHamburger = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`fixed sm:hidden right-4 top-4 cursor-pointer z-20 p-3 rounded-md backdrop-blur-sm transition-all duration-300 ease-out ${isOpen ? 'bg-none' : 'bg-[#F5F5F5]/60'
                        }`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
        >
            <div className="w-8 h-8 relative flex flex-col justify-center items-center z-50">
                {/* Top line */}
                <span
                    className={`bg-black  h-0.5 w-8  transition-all duration-300 ease-out absolute ${isOpen ? 'rotate-45 bg-white h-1' : '-translate-y-2'
                        }`}
                />
                {/* Middle line */}
                <span
                    className={`bg-black  block h-0.5 w-8  transition-all duration-300 ease-out absolute ${isOpen ? 'opacity-0 bg-white h-1' : 'opacity-100'
                        }`}
                />
                {/* Bottom line */}
                <span
                    className={`bg-black  block h-0.5 w-8  transition-all duration-300 ease-out absolute ${isOpen ? '-rotate-45 bg-white h-1' : 'translate-y-2'
                        }`}
                />
            </div>
        </button>
    );
};

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const handleNav = () => {
        setMenuOpen(!menuOpen);
    };

    // Close menu when clicking outside or pressing escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (menuOpen && !target.closest('[data-mobile-menu]') && !target.closest('[data-hamburger]')) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [menuOpen]);

    const getLinkClasses = (path: string) => {
        return `hover:bg-white hover:text-black w-fit p-1 transition-colors duration-200 ${pathname === path ? "underline underline-offset-8 decoration-white  transition-colors duration-200" : ""
            }`;
    };

    return (
        <nav className='text-white font-sans text-5xl font-semibold'>


            {/* Animated Hamburger Button */}
            <div data-hamburger className='z-10'>
                <AnimatedHamburger isOpen={menuOpen} onClick={handleNav} />
            </div>



            {/* Mobile Menu */}
            <div
                data-mobile-menu
                className={`fixed left-0 top-0 w-screen sm:hidden h-screen bg-[#2A2A2A] p-10 z-10 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className='flex flex-col gap-10 mt-16'>
                    <ul className='flex flex-col gap-12'>
                        <li className={`${getLinkClasses("/")} `} onClick={() => setMenuOpen(false)}>
                            <Link href="/" className="block w-full">HOME</Link>
                        </li>
                        <li className={`${getLinkClasses("/africa")} `} onClick={() => setMenuOpen(false)}>
                            <Link href="/africa" className="block w-full">AFRICA</Link>
                        </li>
                        <li className={`${getLinkClasses("/asia")} `} onClick={() => setMenuOpen(false)}>
                            <Link href="/asia" className="block w-full">ASIA</Link>
                        </li>
                        <li className={`${getLinkClasses("/europe")} `} onClick={() => setMenuOpen(false)}>
                            <Link href="/europe" className="block w-full">EUROPE</Link>
                        </li>
                        <li className={`${getLinkClasses("/north-america")} `} onClick={() => setMenuOpen(false)}>
                            <Link href="/north-america" className="block w-full">NORTH AMERICA</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;