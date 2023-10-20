import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAccount } from "./AccountContext";
import { db } from "@/db/dexie";
import { useSearchParams } from "react-router-dom";

type Props = {};

function AccountSwitcher({}: Props) {
  const { account, accounts, setAccount } = useAccount();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const addAccountHandler = async () => {
    if (!name) {
      return alert("Please Enter Name");
    }
    await db.accounts.add({
      name,
      createdAt: new Date(),
    });
    setOpen(false);
  };

  return (
    <div className="flex ">
      <Select
        value={account.name}
        onValueChange={(selectedValue) => {
          setAccount(
            accounts.find((account) => account.name === selectedValue)
          );
          setSearchParams({});
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={account.name} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {accounts.map((account, i) => {
              return (
                <SelectItem value={account.name} key={i}>
                  {account.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
          <SelectSeparator></SelectSeparator>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Account</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addAccountHandler}>Add Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SelectContent>
      </Select>
    </div>
  );
}

export default AccountSwitcher;
