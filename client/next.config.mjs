/** @type {import('next').NextConfig} */
const API_URL = process.env.API_URL;
const nextConfig = {
  env: {
    backendAPI: `${API_URL}/api`,
  },
};

export default nextConfig;
