import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, parse, sub } from "date-fns";
import { CalendarIcon, Columns, DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { DataTablePagination } from "../shared/DataTablePagination";
import { utils, writeFile } from "xlsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [fromDate, setFromDate] = useState(sub(new Date(), { weeks: 1 }));
  const [toDate, setToDate] = useState(new Date());

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  useEffect(() => {
    table
      .getColumn("type")
      ?.setFilterValue(searchParams.get("type")?.split("-"));
    table
      .getColumn("category")
      ?.setFilterValue(searchParams.get("category")?.split("-"));
    table
      .getColumn("subcategory")
      ?.setFilterValue(searchParams.get("subcategory")?.split("-"));
    if (searchParams.has("from") && searchParams.has("to")) {
      table.getColumn("createdAt")?.setFilterValue({
        //@ts-ignore
        from: parse(searchParams.get("from"), "ddMMyyyy", new Date()),
        //@ts-ignore
        to: parse(searchParams.get("to"), "ddMMyyyy", new Date()),
      });
    }
  }, [location.search]);

  const exportToXLSX = () => {
    const exportableData = table.getSortedRowModel().rows.map((row) => {
      return row.original;
    });
    const worksheet = utils.json_to_sheet(exportableData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Transactions Data");
    //@ts-ignore
    utils.sheet_add_aoa(worksheet, [Object.keys(exportableData[0])], {
      origin: "A1",
    });
    writeFile(workbook, `Transactions.xlsx`, { compression: true });
  };

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center py-4">
          <Input
            placeholder="Search..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-2 ml-5">
            From
            <Popover>
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
                    if (!selectedDay) return;
                    setFromDate(selectedDay);
                    setSearchParams({
                      ...Object.fromEntries(searchParams),
                      from: format(selectedDay, "ddMMyyyy"),
                      to: format(toDate, "ddMMyyyy"),
                    });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            To
            <Popover>
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
                    if (!selectedDay) return;
                    setToDate(selectedDay);
                    setSearchParams({
                      ...Object.fromEntries(searchParams),
                      to: format(selectedDay, "ddMMyyyy"),
                      from: format(fromDate, "ddMMyyyy"),
                    });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Columns />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={exportToXLSX}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export To Excel
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="m-2">
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );
}
