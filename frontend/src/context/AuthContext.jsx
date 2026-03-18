import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedVendor = localStorage.getItem("vendor");
      
      if (storedVendor) {
        const vendor = JSON.parse(storedVendor);
        return { ...vendor, role: 'vendor' };
      }
      if (storedUser) {
        const user = JSON.parse(storedUser);
       
        return { ...user, role: user.role?.toLowerCase() || 'customer' };
      }
      return null;
    } catch (err) {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("vendor");
    localStorage.removeItem("token");
    localStorage.removeItem("vendorToken");
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
