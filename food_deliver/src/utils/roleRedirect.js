export const getDashboardRoute = () => {
  const userStr = sessionStorage.getItem("user");
  if (!userStr) return "/";

  try {
    const user = JSON.parse(userStr);
    const role = user.role;

    console.log(`[ROUTING] Evaluating role: ${role}`);
    const normalizedRole = role?.toUpperCase();

    if (normalizedRole === "ADMIN" || normalizedRole === "RESTAURANT_OWNER") return "/admin/dashboard";
    if (normalizedRole === "DELIVERY_PARTNER" || normalizedRole === "DELIVERY") return "/delivery/dashboard";
    return "/home"; // Default USER
  } catch (error) {
    return "/";
  }
};
