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
import { Transaction, db } from "@/db/dexie";
import { cn } from "@/lib/utils";
import { rankItem } from "@tanstack/match-sorter-utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format, isSameDay, isWithinInterval } from "date-fns";
import { Pencil, Trash2Icon } from "lucide-react";
import { DataTableColumnHeader } from "../shared/Table/DataTableColumnHeader";
import UpdateExpense from "./UpdateExpense";

export const columns: ColumnDef<Transaction>[] = [
  {
    header: ({ column }) => {
      return (
        <div className="w-14 mx-auto">
          <DataTableColumnHeader column={column} title="Amount" />
        </div>
      );
    },
    accessorKey: "amount",
    cell: AmountCell,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    filterFn: (row, columnId, value, addMeta) => {
      const itemRank = rankItem(row.getValue(columnId), value);
      addMeta({
        itemRank,
      });
      return itemRank.passed;
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
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Category" />;
    },
    filterFn: (row, columnId, filter) => {
      return (filter as string[]).includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "subcategory",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Subcategory" />;
    },
    filterFn: (row, columnId, filter) => {
      return (filter as string[]).includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created On" />;
    },
    filterFn: createdAtFilterFn,
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

function AmountCell({ row }: { row: Row<Transaction> }) {
  return (
    <p className="text-right">
      {row.original.amount.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
        style: "currency",
        currency: "INR",
      })}
    </p>
  );
}

function TypeCell({ row }: { row: Row<Transaction> }) {
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

function ActionCell({ row }: { row: Row<Transaction> }) {
  const transaction = row.original;
  const deleteTransaction = async () => {
    if (!transaction.id) {
      return console.error("Delete Error: No id found for", transaction);
    }
    await db.transactions.delete(transaction.id);
  };
  return (
    <div className="flex gap-2 items-center justify-center">
      <UpdateExpense
        original={transaction}
        trigger={
          <Button size="icon" variant="ghost">
            <Pencil className="h-4 w-4 text-primary" />
          </Button>
        }
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="icon" variant="ghost">
            <Trash2Icon className="h-4 w-4 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={deleteTransaction}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function createdAtFilterFn(
  row: Row<Transaction>,
  columnId: string,
  filter: any
) {
  return (
    isWithinInterval(row.getValue(columnId), {
      start: filter.from,
      end: filter.to,
    }) ||
    isSameDay(row.getValue(columnId), filter.from) ||
    isSameDay(row.getValue(columnId), filter.to)
  );
}
