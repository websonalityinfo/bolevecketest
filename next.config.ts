// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true, 
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/dkpyxmr2k/image/upload/**', 
            },
        ],
    },
};

export default nextConfig;