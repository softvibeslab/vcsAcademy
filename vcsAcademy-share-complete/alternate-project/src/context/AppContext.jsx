import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { moduleDefinitions } from "../data/seedData";
import { academyApi } from "../lib/api";

const AppContext = createContext(null);

const emptyState = {
  dashboard: {
    repName: "",
    team: "",
    property: "",
    metrics: [],
    priorities: [],
  },
  modules: {
    strategy: [],
    topProducerPath: [],
    coaching: [],
    resources: [],
  },
};

function normalizeModules(modules = {}) {
  return {
    strategy: modules.strategy || [],
    topProducerPath: modules.topProducerPath || [],
    coaching: modules.coaching || [],
    resources: modules.resources || [],
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(emptyState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  const loadPublicBootstrap = useCallback(async () => {
    const response = await academyApi.getPublicBootstrap();

    setState({
      dashboard: response.dashboard,
      modules: normalizeModules(response.modules),
    });
  }, []);

  const loadAdminBootstrap = useCallback(async () => {
    const response = await academyApi.getAdminBootstrap();

    setState({
      dashboard: response.dashboard,
      modules: normalizeModules(response.modules),
    });
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      await loadPublicBootstrap();
      const currentUser = await academyApi.getCurrentUserSafe();

      if (currentUser?.role === "admin") {
        setAdminUser(currentUser);
        await loadAdminBootstrap();
      } else {
        setAdminUser(null);
      }
    } catch (loadError) {
      setError(loadError.message || "Failed to connect to FastAPI.");
    } finally {
      setIsLoading(false);
    }
  }, [loadAdminBootstrap, loadPublicBootstrap]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const actions = useMemo(
    () => ({
      async loginAdmin(credentials) {
        setIsAdminLoading(true);
        setAdminError("");

        try {
          await academyApi.loginAdmin(credentials);
          const currentUser = await academyApi.getCurrentUserSafe();

          if (!currentUser || currentUser.role !== "admin") {
            await academyApi.logoutAdmin();
            throw new Error("Admin credentials are required.");
          }

          setAdminUser(currentUser);
          await loadAdminBootstrap();
          return currentUser;
        } catch (loginError) {
          setAdminError(loginError.message || "Admin login failed.");
          throw loginError;
        } finally {
          setIsAdminLoading(false);
        }
      },

      async logoutAdmin() {
        setIsAdminLoading(true);
        setAdminError("");

        try {
          await academyApi.logoutAdmin();
          setAdminUser(null);
          await loadPublicBootstrap();
        } catch (logoutError) {
          setAdminError(logoutError.message || "Logout failed.");
          throw logoutError;
        } finally {
          setIsAdminLoading(false);
        }
      },

      async createItem(moduleKey, item) {
        setAdminError("");
        await academyApi.createModuleItem(moduleKey, item);
        await loadAdminBootstrap();
      },

      async updateItem(moduleKey, itemId, updates) {
        setAdminError("");
        await academyApi.updateModuleItem(moduleKey, itemId, updates);
        await loadAdminBootstrap();
      },

      async deleteItem(moduleKey, itemId) {
        setAdminError("");
        await academyApi.deleteModuleItem(moduleKey, itemId);
        await loadAdminBootstrap();
      },

      async resetData() {
        setAdminError("");
        await academyApi.resetAdminData();
        await loadAdminBootstrap();
      },

      async refreshData() {
        await refreshData();
      },
    }),
    [loadAdminBootstrap, loadPublicBootstrap, refreshData]
  );

  const value = useMemo(
    () => ({
      state,
      moduleDefinitions,
      isLoading,
      error,
      adminUser,
      isAdminLoading,
      adminError,
      apiBaseUrl: academyApi.getApiBaseUrl(),
      actions,
    }),
    [
      state,
      isLoading,
      error,
      adminUser,
      isAdminLoading,
      adminError,
      actions,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
