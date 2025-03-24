"use client";

import Idiomas from "@/components/LanguageDesktop";
import Secciones from "@/components/SectionsDesktop";
import { usePathname } from "next/navigation";

const hiddenSidebarPaths = ["/authenticate/login", "/authenticate/register", "/lobby", "/games"];

export default function ManagerSideBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar = hiddenSidebarPaths.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <>
      {!hideSidebar && (
        <div className="fixed top-0 left-0 h-full flex flex-row">
          {/* <NavBarMovile/> */}
          <Secciones />
          <Idiomas />
        </div>
      )}

      <div
        className={
          !hideSidebar
        ? `p-4 md:p-8 md:ml-[330px] h-screen overflow-y-auto`
        : "p-4 md:p-8 h-screen overflow-y-auto"
        }
      >
        <main className="h-full">{children}</main>
      </div>
    </>
  );
}
