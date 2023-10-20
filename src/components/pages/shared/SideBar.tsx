import { cn } from "@/lib/utils";
import clsx from "clsx";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import AccountSwitcher from "./AccountSwitcher";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

function SideBar(props: Props) {
  const location = useLocation();
  const sidebarItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Category",
      href: "/category",
    },
    {
      name: "Subcategory",
      href: "/subcategory",
    },
  ];

  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-1",
        props.className ? props.className : null
      )}
    >
      <AccountSwitcher />
      {sidebarItems.map((item, i) => {
        return (
          <Link
            to={item.href}
            key={i}
            className={clsx([
              "underline-offset-4",
              item.href === location.pathname ? "underline" : "",
            ])}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}

export default SideBar;
