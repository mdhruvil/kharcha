import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db/dexie";
import { handleInvalidMsg } from "@/lib/utils";
import { useRef, useState } from "react";
import { useAccount } from "../shared/AccountContext";

interface Props {}

function CreateCategory({}: Props) {
  const [open, setOpen] = useState(false);
  const { account } = useAccount();
  const catformRef = useRef<HTMLFormElement>(null);

  const handleCreateCategory = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // e.preventDefault();
    // return console.log(catformRef);
    if (!catformRef.current?.checkValidity()) {
      return;
    }
    e.preventDefault();
    const type = (catformRef.current[1] as EventTarget & HTMLSelectElement)
      .value as "expense" | "income";
    const name = (catformRef.current[2] as EventTarget & HTMLInputElement)
      .value;
    const description = (
      catformRef.current[3] as EventTarget & HTMLTextAreaElement
    ).value;
    const id = await db.categories.add({
      name,
      description,
      createdAt: Date.now(),
      type,
      account: account.name,
    });
    console.log("Acc added with id " + id);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Category</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form ref={catformRef}>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Add details of Category here. Click add when you are done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* //! type */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select defaultValue="expense">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Expense" />
                  </SelectTrigger>
                  <SelectContent id="type">
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* //! name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Category name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  required
                  onInvalid={(e) => {
                    handleInvalidMsg(e, "Please Enter Category name");
                  }}
                  onInput={(e) => {
                    handleInvalidMsg(e, "");
                  }}
                />
              </div>
              {/* //! Description */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="title" className="text-right">
                  Description (optional)
                </Label>
                <Textarea id="title" className="col-span-3" />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" onClick={handleCreateCategory}>
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateCategory;
