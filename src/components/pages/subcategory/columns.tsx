import { Subcategory } from "@/db/dexie";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../shared/Table/DataTableColumnHeader";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
