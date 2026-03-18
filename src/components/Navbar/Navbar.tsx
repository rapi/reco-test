import { Drawer, ListItemButton } from "@mui/material";
import Image from "next/image";
import classes from "./Navbar.module.css";
import { usePathname } from "next/dist/client/components/navigation";
import { useMemo } from "react";
export const Navbar = () => {
  const links = useMemo<{ href: string; name: string }[]>(
    () => [
      { href: "/", name: "Apps Discovery" },
      { href: "/inventory", name: "Apps Inventory" },
      { href: "/settings", name: "Apps Settings" },
    ],
    [],
  );
  const path = usePathname();

  return (
    <Drawer open={true} variant="permanent">
      <div className={classes.navbar}>
        <Image
          src="https://cdn.prod.website-files.com/644fc991ce69ff0d3bdbeb63/6797b48d427a3acb97fd3b55_Logo.svg"
          alt="Reco Logo"
          width={100}
          height={100}
        />
        {links.map((link) => (
          <ListItemButton
            href={link.href}
            key={link.name}
            className={path === link.href ? classes.active : ""}
          >
            {link.name}
          </ListItemButton>
        ))}
      </div>
    </Drawer>
  );
};
