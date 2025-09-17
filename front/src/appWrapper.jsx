import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AppWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Detecta tipo de navegação (moderno + fallback)
    let navType = "navigate";
    if (performance?.getEntriesByType) {
      const [nav] = performance.getEntriesByType("navigation");
      if (nav?.type) navType = nav.type; // 'reload' | 'navigate' | 'back_forward'
    } else if (performance?.navigation) {
      navType =
        performance.navigation.type === performance.navigation.TYPE_RELOAD
          ? "reload"
          : "navigate";
    }

    const isReload = navType === "reload";
    const publicRoutes = ["/", "/login", "/cadastro", "/resetar-senha"];
    const isPublic = publicRoutes.includes(location.pathname);

    // 👉 Redirect “duro” garante que a URL mostre /home no domínio
    if (token && isReload && isPublic) {
      window.location.replace("/home");
    }
  }, [location.pathname]);

  return <>{children}</>;
}
