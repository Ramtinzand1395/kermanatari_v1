const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  compiler: {
  removeConsole: process.env.NODE_ENV === "production",
  },
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // این مهم‌ترین بخش:
  browserslist: {
    production: [
      ">0.3%",
      "not dead",
      "not op_mini all",
      "not IE 11",
    ],
    development: ["last 1 chrome version", "last 1 firefox version"],
  },
};

module.exports = nextConfig;
