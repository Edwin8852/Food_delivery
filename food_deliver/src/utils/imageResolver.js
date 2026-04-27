const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

export const getFoodImage = (path) => {
  if (path && (path.startsWith("http") || path.startsWith("https"))) return path;
  if (path && path.startsWith("/")) return `${BASE_URL}${path}`;
  return FALLBACK_IMAGE;
};
