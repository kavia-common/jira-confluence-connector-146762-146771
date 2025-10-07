'use client';
import Link from 'next/link';

export default function CorsLink() {
  return (
    <div className="text-sm">
      For CORS headers and auth status verification, open{' '}
      <Link href="/diagnostics/_cors" className="text-blue-600 underline">
        CORS Diagnostics
      </Link>.
    </div>
  );
}
