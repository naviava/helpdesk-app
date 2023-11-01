// @ts-check
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "files.edgestore.dev",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },
};

module.exports = withPWA(nextConfig);
