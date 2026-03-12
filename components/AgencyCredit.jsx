'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function AgencyCredit() {
    return (
        <Link
            href="https://duadev.al"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Developed by DuaDev"
            className="group inline-flex items-center gap-2 text-xs transition-all"
        >
            <span className="font-body leading-none text-cream/40 group-hover:text-cream/70 transition-colors">
                Developed by
            </span>

            <Image
                src="/duadev-logo.png"
                alt="DuaDev"
                width={75}
                height={20}
                className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
            />
        </Link>
    )
}