'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        const response = await fetch('/api/logout', {
            method: 'POST',
        });

        if (response.ok) {
            router.push('/login');
        } else {
            console.error('Logout failed');
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl">
                    OpenRouter Models
                </Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <button className="btn btn-ghost" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
