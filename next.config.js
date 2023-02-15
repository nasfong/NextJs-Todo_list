/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  source: "/api/(.*)",
  headers: [
    { key: "Access-Control-Allow-Credentials", value: "true" },
    { key: "Access-Control-Allow-Origin", value: "https://next-tsx-nine.vercel.app/" },
    // ...
  ]
}

module.exports = nextConfig
