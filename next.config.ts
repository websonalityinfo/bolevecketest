import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: false, // Zapnout optimalizaci obrázků
        formats: ['image/webp', 'image/avif'], // Moderní formáty pro rychlejší načítání
        deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responzivní velikosti
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Velikosti pro ikony
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
// Tady jsem přidal komentář pro vynucení aktualizace na Netlify