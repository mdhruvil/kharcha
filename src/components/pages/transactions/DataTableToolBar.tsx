import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Transaction, db } from "@/db/dexie";
import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { format, sub } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { CalendarIcon, DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { utils, writeFile } from "xlsx";
import { useAccount } from "../shared/AccountContext";
import { DataTableFacetedFilter } from "../shared/Table/DataTableFactedFilter";
import { DataTableViewOptions } from "../shared/Table/DataTableViewOption";

interface Props<TData> {
  table: Table<TData>;
}

function DataTableToolBar<TData>({ table }: Props<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [fromDate, setFromDate] = useState(sub(new Date(), { weeks: 1 }));
  const [toDate, setToDate] = useState(new Date());
  const [fromModal, setFromModal] = useState(false);
  const [toModal, setToModal] = useState(false);

  const { account } = useAccount();
  const categories = useLiveQuery(() => {
    return db.categories.where("account").equals(account.name).toArray();
  }, [account]);
  const subcategories = useLiveQuery(() => {
    return db.subcategories.where("account").equals(account.name).toArray();
  }, [account]);

  useEffect(() => {
    table.getColumn("createdAt")?.setFilterValue({
      from: fromDate,
      to: toDate,
    });
  }, [fromDate, toDate]);

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

  if (!categories || !subcategories) {
    return "Loading";
  }

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-start flex-col gap-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex">
          <div className="flex gap-2 items-center ml-2">
            {table.getColumn("type") && (
              <DataTableFacetedFilter
                column={table.getColumn("type")}
                title="type"
                options={["income", "expense"]}
              />
            )}
            {table.getColumn("category") && (
              <DataTableFacetedFilter
                column={table.getColumn("category")}
                title="Category"
                options={categories?.map((category) => category.name)}
              />
            )}
            {table.getColumn("subcategory") && (
              <DataTableFacetedFilter
                column={table.getColumn("subcategory")}
                title="Subcategory"
                options={subcategories?.map((subcategory) => subcategory.name)}
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
          {/* //? Date Picker  */}
          <div className="flex items-center gap-2 ml-5">
            From
            <Popover open={fromModal} onOpenChange={setFromModal}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-fit justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? (
                    format(fromDate, "dd/MM/yyyy")
                  ) : (
                    <span>Pick a fromDate</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(selectedDay) => {
                    setFromModal(false);
                    if (!selectedDay) return;
                    setFromDate(selectedDay);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            To
            <Popover open={toModal} onOpenChange={setToModal}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-fit justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? (
                    format(toDate, "dd/MM/yyyy")
                  ) : (
                    <span>Pick a toDate</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(selectedDay) => {
                    setToModal(false);
                    if (!selectedDay) return;
                    setToDate(selectedDay);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
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
