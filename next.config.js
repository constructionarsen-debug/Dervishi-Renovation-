/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow common external image hosts used in this project
    // (UploadThing, Unsplash, Google avatars, etc.)
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

module.exports = nextConfig;
