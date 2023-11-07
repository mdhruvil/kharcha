import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/db/dexie";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { DataTableFacetedFilter } from "../shared/Table/DataTableFactedFilter";
import { DataTableViewOptions } from "../shared/Table/DataTableViewOption";

interface Props<TData> {
  table: Table<TData>;
}

function DataTableToolBar<TData>({ table }: Props<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const exportToXLSX = () => {
    const exportableData = table.getSortedRowModel().rows.map((row) => {
      return row.original as Transaction;
    });
    const worksheet = utils.json_to_sheet(exportableData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Transactions Data");
    utils.sheet_add_aoa(worksheet, [Object.keys(exportableData[0])], {
      origin: "A1",
    });
    writeFile(workbook, `Transactions.xlsx`, { compression: true });
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <Input
          placeholder="Search..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2 items-center ml-2">
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              column={table.getColumn("type")}
              title="type"
              options={["income", "expense"]}
            />
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <DataTableViewOptions table={table} />
        <Button variant="outline" onClick={exportToXLSX}>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}

export default DataTableToolBar;
