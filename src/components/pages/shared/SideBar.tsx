import { cn } from "@/lib/utils";
import clsx from "clsx";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import AccountSwitcher from "./AccountSwitcher";
import { Separator } from "@/components/ui/separator";
import CreateExpense from "../transactions/CreateExpense";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { exportDB, importInto } from "dexie-export-import";
import { db } from "@/db/dexie";
import { format } from "date-fns";
import { FileDown, FileUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

  function saveFile(blob: Blob, filename: string) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }

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
      <Input
        type="file"
        className="hidden"
        id="importfile"
        onChange={async (e) => {
          console.log(e.target.files);
          if (!e.target.files) {
            console.error("File Not found");
            return;
          }
          await importInto(db, e.target.files[0], {
            clearTablesBeforeImport: true,
          });
        }}
      ></Input>
      <Separator className="my-2" />
      <CreateExpense />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Backup</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={async () => {
              const blob = await exportDB(db);
              saveFile(
                blob,
                `HisabBackup_${format(new Date(), "dd-MM-yyyy_HH-mm")}.dhruvil`
              );
            }}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Backup Data
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Label htmlFor="importfile" className="flex font-normal">
              <FileUp className="h-4 w-4 mr-2" />
              Import Backup
            </Label>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SideBar;
