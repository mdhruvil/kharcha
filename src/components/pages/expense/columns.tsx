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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Transaction, db } from "@/db/dexie";
import { rankItem } from "@tanstack/match-sorter-utils";
import { ColumnDef } from "@tanstack/react-table";
import { format, isSameDay, isWithinInterval } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { FilterIcon, MoreHorizontal, Pencil, Trash2Icon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import UpdateExpense from "./UpdateExpense";
import { useAccount } from "../shared/AccountContext";

export const columns: ColumnDef<Transaction>[] = [
  {
    header: () => {
      return <p className="text-right pr-4">Amount</p>;
    },
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <p className="text-right pr-4">
          {row.original.amount.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
            style: "currency",
            currency: "INR",
          })}
        </p>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
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
    header: () => {
      const [searchParams, setSearchParams] = useSearchParams();
      function handleChecked({
        checked,
        type,
      }: {
        checked: boolean;
        type: "income" | "expense";
      }) {
        if (checked) {
          if (!searchParams.has("type")) {
            return setSearchParams({
              ...Object.fromEntries(searchParams),
              type,
            });
          } else {
            return setSearchParams({
              ...Object.fromEntries(searchParams),
              type: searchParams.get("type") + "-" + type,
            });
          }
        } else {
          if (!searchParams.has("type")) {
            return;
          } else {
            if (!searchParams.get("type")?.includes("-")) {
              searchParams.delete("type");
              setSearchParams(searchParams);
            } else {
              return setSearchParams({
                ...Object.fromEntries(searchParams),
                type: type === "income" ? "expense" : "income",
              });
            }
          }
        }
      }

      return (
        <div className="flex items-center">
          Type
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-2">
                <FilterIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuCheckboxItem
                checked={searchParams
                  .get("type")
                  ?.split("-")
                  .includes("income")}
                onCheckedChange={(checked) => {
                  handleChecked({ checked, type: "income" });
                }}
              >
                Income
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={searchParams
                  .get("type")
                  ?.split("-")
                  .includes("expense")}
                onCheckedChange={(checked) => {
                  handleChecked({ checked, type: "expense" });
                }}
              >
                Expense
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    cell: ({ row }) => {
      const transType = row.getValue("type") as string;
      if (transType === "income") {
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 hover:bg-green-100/80 text-green-800 rounded-full"
          >
            {transType.charAt(0).toUpperCase() + transType.slice(1)}
          </Badge>
        );
      }
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 hover:bg-red-100/80 text-red-800 rounded-full"
        >
          {transType.charAt(0).toUpperCase() + transType.slice(1)}
        </Badge>
      );
    },
    filterFn: (row, columnId, filter) => {
      return (filter as string[]).includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "category",
    header: () => {
      const { account } = useAccount();
      const categories = useLiveQuery(() => {
        return db.categories.where("account").equals(account.name).toArray();
      }, [account]);
      const [searchParams, setSearchParams] = useSearchParams();

      function handleChecked({
        checked,
        category,
      }: {
        checked: boolean;
        category: string;
      }) {
        if (checked) {
          if (!searchParams.has("category")) {
            return setSearchParams({
              ...Object.fromEntries(searchParams),
              category,
            });
          } else {
            return setSearchParams({
              ...Object.fromEntries(searchParams),
              category: searchParams.get("category") + "-" + category,
            });
          }
        } else {
          if (!searchParams.has("category")) {
            return;
          } else {
            if (!searchParams.get("category")?.includes("-")) {
              searchParams.delete("category");
              setSearchParams(searchParams);
            } else {
              const paramsArray = searchParams.get("category")?.split("-");
              if (!paramsArray) return alert("Something Gone wrong");
              const indxOfCategory = paramsArray.indexOf(category);
              paramsArray?.splice(indxOfCategory, 1);
              return setSearchParams({
                ...Object.fromEntries(searchParams),
                category: paramsArray?.join("-"),
              });
            }
          }
        }
      }

      if (!categories) return "Loading";
      return (
        <div className="flex items-center">
          Category
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-2">
                <FilterIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              {categories.map((category) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={searchParams
                      .get("category")
                      ?.split("-")
                      .includes(category.name)}
                    onCheckedChange={(checked) => {
                      handleChecked({ checked, category: category.name });
                    }}
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    filterFn: (row, columnId, filter) => {
      return (filter as string[]).includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "subcategory",
    header: () => {
      const { account } = useAccount();
      const subcategories = useLiveQuery(() => {
        return db.subcategories.where("account").equals(account.name).toArray();
      }, [account]);
      const [searchParams, setSearchParams] = useSearchParams();

      function handleChecked({
        checked,
        subcategory,
      }: {
        checked: boolean;
        subcategory: string;
      }) {
        if (checked) {
          if (!searchParams.has("subcategory")) {
            return setSearchParams({
              ...Object.fromEntries(searchParams),
              subcategory,
            });
          } else {
            return setSearchParams({
              ...Object.fromEntries(searchParams),
              subcategory: searchParams.get("subcategory") + "-" + subcategory,
            });
          }
        } else {
          if (!searchParams.has("subcategory")) {
            return;
          } else {
            if (!searchParams.get("subcategory")?.includes("-")) {
              searchParams.delete("subcategory");
              setSearchParams(searchParams);
            } else {
              const paramsArray = searchParams.get("subcategory")?.split("-");
              if (!paramsArray) return alert("Something Gone wrong");
              const indxOfsubCategory = paramsArray.indexOf(subcategory);
              paramsArray?.splice(indxOfsubCategory, 1);
              return setSearchParams({
                ...Object.fromEntries(searchParams),
                subcategory: paramsArray?.join("-"),
              });
            }
          }
        }
      }

      if (!subcategories) return "Loading";
      return (
        <div className="flex items-center">
          Subcategory
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-2">
                <FilterIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              {subcategories.map((subcategory) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={subcategory.id}
                    checked={searchParams
                      .get("subcategory")
                      ?.split("-")
                      .includes(subcategory.name)}
                    onCheckedChange={(checked) => {
                      handleChecked({ checked, subcategory: subcategory.name });
                    }}
                  >
                    {subcategory.name}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    filterFn: (row, columnId, filter) => {
      return (filter as string[]).includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created On",
    filterFn: (row, columnId, filter) => {
      return (
        isWithinInterval(row.getValue(columnId), {
          start: filter.from,
          end: filter.to,
        }) ||
        isSameDay(row.getValue(columnId), filter.from) ||
        isSameDay(row.getValue(columnId), filter.to)
      );
    },
    cell: ({ row }) => {
      return format(row.original.createdAt, "dd/MM/yyyy");
    },
    sortingFn: "datetime",
    sortDescFirst: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      const deleteTransaction = async () => {
        if (!transaction.id) {
          return console.error("Delete Error: No id found for", transaction);
        }
        await db.transactions.delete(transaction.id);
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <UpdateExpense
              original={transaction}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              }
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2Icon className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this transaction.
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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
