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
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category, db } from "@/db/dexie";
import { cn } from "@/lib/utils";
import { rankItem } from "@tanstack/match-sorter-utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, Trash2Icon } from "lucide-react";
import { DataTableColumnHeader } from "../shared/Table/DataTableColumnHeader";
import { format } from "date-fns";
import { useAccount } from "../shared/AccountContext";
import { useLiveQuery } from "dexie-react-hooks";

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "type",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Type" />;
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

function TypeCell({ row }: { row: Row<Category> }) {
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

function ActionCell({ row }: { row: Row<Category> }) {
  const { account } = useAccount();
  const transactions = useLiveQuery(() => {
    return db.transactions.where("account").equals(account.name).toArray();
  });
  const selectedCategory = row.original;
  if (!transactions) {
    return "Loading";
  }

  const handleClick = () => {
    const hasTransactions =
      transactions.findIndex(
        (selectedTxn) => selectedTxn.category === selectedCategory.name
      ) !== -1;
    alert(hasTransactions);
  };

  return (
    <Button onClick={handleClick}>
      <Trash2Icon className="h-4 w-4" />
    </Button>
  );
}
