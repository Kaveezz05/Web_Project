import { useState, useEffect } from "react";

const useAuth = () => {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event("storage")); // Force update in other components
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = sessionStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { user, login, logout };
};

export default useAuth;
