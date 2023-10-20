import CreateExpense from "@/components/pages/expense/CreateExpense";
import { columns } from "@/components/pages/expense/columns";
import { DataTable } from "@/components/pages/expense/data-table";
import { useAccount } from "@/components/pages/shared/AccountContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db/dexie";
import { generateData } from "@/db/generateData";
import { format } from "date-fns";
import { exportDB, importDB } from "dexie-export-import";
import { useLiveQuery } from "dexie-react-hooks";
import { FileDown, FileUp, IndianRupee } from "lucide-react";

type Props = {};

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

function Home({}: Props) {
  const { account } = useAccount();

  let data = useLiveQuery(() => {
    return db.transactions.where("account").equals(account.name).toArray();
  }, [account]);

  if (!data) {
    return "Loading...";
  }

  return (
    <>
      {/* <SideBar /> */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Total Income
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {data
                .reduce((total, transaction) => {
                  return transaction.type === "income"
                    ? total + transaction.amount
                    : total;
                }, 0)
                .toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                  style: "currency",
                  currency: "INR",
                })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Total Expense
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {data
                .reduce((total, transaction) => {
                  return transaction.type === "expense"
                    ? total + transaction.amount
                    : total;
                }, 0)
                .toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                  style: "currency",
                  currency: "INR",
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Balance
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data
                .reduce((total, transaction) => {
                  return transaction.type === "income"
                    ? total + transaction.amount
                    : transaction.type === "expense"
                    ? total - transaction.amount
                    : total;
                }, 0)
                .toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                  style: "currency",
                  currency: "INR",
                })}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-between">
        <CreateExpense />
        <div className="flex gap-2">
          <Button
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
          </Button>
          <Label
            htmlFor="importfile"
            className={buttonVariants({ variant: "outline" })}
          >
            <FileUp className="h-4 w-4 mr-2" />
            Import Backup
          </Label>
          <Input
            type="file"
            className="hidden"
            id="importfile"
            onChange={async (e) => {
              if (!e.target.files) {
                console.error("File Not found");
                return;
              }
              await importDB(e.target.files[0]);
            }}
          ></Input>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
      <footer className="fixed bottom-0 left-0 flex items-center justify-center w-full mb-2">
        <p className="text-center text-sm leading-loose">
          Built by Dhruvil Moradiya
        </p>
      </footer>
    </>
  );
}

export default Home;
