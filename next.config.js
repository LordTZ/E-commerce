
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {hostname: "images.unsplash.com", protocol: "https"},
            {hostname: "lh3.googleusercontent.com", protocol: "https"},
        ],
    },
}

module.exports = nextConfig

