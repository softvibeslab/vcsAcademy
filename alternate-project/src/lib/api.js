const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === "object" && body?.detail
        ? body.detail
        : typeof body === "string"
          ? body
          : "Request failed";

    throw new Error(message);
  }

  return body;
}

async function getCurrentUserSafe() {
  try {
    return await request("/api/auth/me", {
      credentials: "include",
    });
  } catch (error) {
    return null;
  }
}

export const academyApi = {
  getApiBaseUrl() {
    return API_BASE_URL;
  },
  getPublicBootstrap() {
    return request("/api/academy/public/bootstrap");
  },
  getAdminBootstrap() {
    return request("/api/academy/admin/bootstrap", {
      credentials: "include",
    });
  },
  loginAdmin(credentials) {
    return request("/api/auth/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(credentials),
    });
  },
  getCurrentUserSafe,
  logoutAdmin() {
    return request("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({}),
    });
  },
  resetAdminData() {
    return request("/api/academy/admin/reset", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({}),
    });
  },
  createModuleItem(moduleKey, payload) {
    return request(`/api/academy/admin/modules/${moduleKey}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
    });
  },
  updateModuleItem(moduleKey, itemId, payload) {
    return request(`/api/academy/admin/modules/${moduleKey}/${itemId}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(payload),
    });
  },
  deleteModuleItem(moduleKey, itemId) {
    return request(`/api/academy/admin/modules/${moduleKey}/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};
