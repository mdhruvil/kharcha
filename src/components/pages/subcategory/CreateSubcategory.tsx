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
import { useLiveQuery } from "dexie-react-hooks";
import { useRef, useState } from "react";
import { useAccount } from "../shared/AccountContext";

interface Props {}

function CreateSubcategory({}: Props) {
  const [open, setOpen] = useState(false);
  const [categoryType, setCategoryType] = useState("expense");
  const { account } = useAccount();
  const subcatformRef = useRef<HTMLFormElement>(null);

  const categories = useLiveQuery(() => {
    return db.categories
      .where(["account", "type"])
      .equals([account.name, categoryType])
      .toArray();
  }, [categoryType, account]);

  const handleCreateSubcategory = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // e.preventDefault();
    // return console.log(subcatformRef);
    if (!subcatformRef.current?.checkValidity()) {
      return;
    }
    e.preventDefault();
    const type = (subcatformRef.current[1] as EventTarget & HTMLSelectElement)
      .value as "expense" | "income";
    const name = (subcatformRef.current[4] as EventTarget & HTMLInputElement)
      .value;
    const description = (
      subcatformRef.current[5] as EventTarget & HTMLTextAreaElement
    ).value;
    const category = (
      subcatformRef.current[3] as EventTarget & HTMLSelectElement
    ).value;

    if (category === "") {
      return alert("Please select Category");
    }
    const id = await db.subcategories.add({
      name,
      description,
      createdAt: Date.now(),
      type,
      category,
      account: account.name,
    });
    console.log("Acc added with id " + id);
    setOpen(false);
  };

  if (!categories) {
    return "Loading...";
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Subcategory</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form ref={subcatformRef}>
            <DialogHeader>
              <DialogTitle>Add Subcategory</DialogTitle>
              <DialogDescription>
                Add details of Sub Category here. Click add when you are done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* //! type */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={categoryType}
                  onValueChange={setCategoryType}
                  defaultValue="expense"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Expense" />
                  </SelectTrigger>
                  <SelectContent id="type">
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* //! category */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={""} />
                  </SelectTrigger>
                  <SelectContent id="category">
                    {categories.map((category) => {
                      return (
                        <SelectItem value={category.name} key={category.id}>
                          {category.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              {/* //! name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Sub Category name
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
              <Button type="submit" onClick={handleCreateSubcategory}>
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateSubcategory;
