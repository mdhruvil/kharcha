import { Subcategory, db } from "@/db/dexie";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../shared/Table/DataTableColumnHeader";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { useAccount } from "../shared/AccountContext";
import { useLiveQuery } from "dexie-react-hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

export const columns: ColumnDef<Subcategory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="ml-5">
          <DataTableColumnHeader column={column} title="Name" />
        </div>
      );
    },
    filterFn: (row, columnId, value, addMeta) => {
      const itemRank = rankItem(row.getValue(columnId), value);
      addMeta({
        itemRank,
      });
      return itemRank.passed;
    },
    cell: ({ row }) => {
      return <div className="ml-5">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <div className="ml-5">
          <DataTableColumnHeader column={column} title="Category" />
        </div>
      );
    },
    filterFn: (row, columnId, filter) => {
      return (filter as string[]).includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <div className="ml-5">
          <DataTableColumnHeader column={column} title="Type" />
        </div>
      );
    },
    cell: TypeCell,
    filterFn: (row, columnId, filter) => {
      return (filter as string[]).includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created On" />;
    },
    cell: ({ row }) => {
      return format(row.original.createdAt, "dd/MM/yyyy");
    },
    sortingFn: "datetime",
    sortDescFirst: true,
  },
  {
    id: "actions",
    cell: ActionCell,
  },
];

function TypeCell({ row }: { row: Row<Subcategory> }) {
  const transType = row.getValue("type") as string;
  const isIncome = transType === "income";

  return (
    <Badge
      variant="secondary"
      className={cn([
        "rounded-full",
        isIncome
          ? "bg-green-100 hover:bg-green-100/80 text-green-800"
          : "bg-red-100 hover:bg-red-100/80 text-red-800",
      ])}
    >
      {transType.charAt(0).toUpperCase() + transType.slice(1)}
    </Badge>
  );
}

function ActionCell({ row }: { row: Row<Subcategory> }) {
  const [deletable, setDeletable] = useState(false);
  const { account } = useAccount();
  const transactions = useLiveQuery(() => {
    return db.transactions.where("account").equals(account.name).toArray();
  });
  const selectedSubCategory = row.original;

  if (!transactions) {
    return "Loading";
  }

  const handleClick = () => {
    const hasTransactions =
      transactions.findIndex(
        (selectedTxn) => selectedTxn.subcategory === selectedSubCategory.name
      ) !== -1;
    setDeletable(!hasTransactions);
  };

  const deleteCategory = async () => {
    if (!selectedSubCategory.id) {
      return console.error(
        "Delete Error: No Id found for category: ",
        selectedSubCategory
      );
    }
    await db.subcategories.delete(selectedSubCategory.id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" onClick={handleClick} size="icon">
          <Trash2Icon className="h-4 w-4 text-red-600" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {deletable
              ? "Do you want to delete this subcategory ? "
              : "You can not delete this subcategory"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {deletable
              ? "This action cannot be undone. This will permanently delete this subcategory."
              : "beacause this category has transaction under it."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{deletable ? "Cancel" : "Ok"}</AlertDialogCancel>
          {deletable && (
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={deleteCategory}
            >
              Delete
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
