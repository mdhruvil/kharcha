import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db/dexie";
import { cn, handleInvalidMsg } from "@/lib/utils";
import { format } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { CalendarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useAccount } from "../shared/AccountContext";

type Props = {};

function CreateExpense({}: Props) {
  const { account } = useAccount();

  const [open, setOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const [selectedType, setSelectedType] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState(new Date());

  const categories = useLiveQuery(() => {
    return db.categories
      .where(["account", "type"])
      .equals([account.name, selectedType])
      .toArray();
  }, [selectedType, account]);

  const subcategories = useLiveQuery(() => {
    return db.subcategories
      .where(["account", "category"])
      .equals([account.name, selectedCategory])
      .toArray();
  }, [selectedCategory, account]);

  const createTransactionRecord = async () => {
    if (!formRef.current) {
      return;
    }
    const type = selectedType as "expense" | "income";
    const amount = (formRef.current[4] as EventTarget & HTMLInputElement).value;
    const name = (formRef.current[5] as EventTarget & HTMLSelectElement).value;
    const description = (
      formRef.current[6] as EventTarget & HTMLTextAreaElement
    ).value;
    const method = (formRef.current[8] as EventTarget & HTMLSelectElement)
      .value as "cash" | "upi" | "bank transfer" | "other";
    const category = (formRef.current[10] as EventTarget & HTMLSelectElement)
      .value;
    const subcategory = (formRef.current[12] as EventTarget & HTMLSelectElement)
      .value;
    if (category === "") return alert("Please Enter Category");
    const id = await db.transactions.add({
      name,
      type,
      category,
      method,
      amount: +amount,
      createdAt: date,
      subcategory,
      description,
      account: account.name,
    });
    return id;
  };

  const handleCreateTransaction = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // e.preventDefault();
    // console.log(formRef);
    // return;
    if (!formRef.current?.checkValidity()) {
      return;
    }
    e.preventDefault();
    await createTransactionRecord();
    setOpen(false);
  };

  if (!categories || !subcategories) {
    return "Loading...";
  }

  async function handleAddAndNew(e: React.MouseEvent<HTMLButtonElement>) {
    if (!formRef.current?.checkValidity()) {
      return;
    }
    e.preventDefault();
    await createTransactionRecord();
    formRef.current.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form ref={formRef}>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Add details of transaction here. Click add when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* //! Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              {/*<Select
                value={selectedType}
                onValueChange={setSelectedType}
                defaultValue="expense"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Expense" />
                </SelectTrigger>
                <SelectContent id="type">
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select> */}
              <RadioGroup
                // defaultValue="expense"
                className="flex"
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <div>
                  <RadioGroupItem
                    value="expense"
                    id="expense"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="expense"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Expense
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="income"
                    id="income"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="income"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Income
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {/* //!Amount */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Amount" className="text-right">
                Amount
              </Label>
              <Input
                id="Amount"
                className="col-span-3"
                required
                type="number"
                onInvalid={(e) => {
                  handleInvalidMsg(e, "Please Enter Amount");
                }}
                onInput={(e) => {
                  handleInvalidMsg(e, "");
                }}
              />
            </div>
            {/* //! Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                className="col-span-3"
                required
                onInvalid={(e) => {
                  handleInvalidMsg(e, "Please Enter Title");
                }}
                onInput={(e) => {
                  handleInvalidMsg(e, "");
                }}
              />
            </div>
            {/* //! Description */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="title" className="text-right">
                Description
              </Label>
              <Textarea
                id="title"
                className="col-span-3"
                onInvalid={(e) => {
                  handleInvalidMsg(e, "Please Enter Description");
                }}
                onInput={(e) => {
                  handleInvalidMsg(e, "");
                }}
              />
            </div>
            {/* //! Method */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Payement Method
              </Label>
              <Select defaultValue="cash">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Cash" />
                </SelectTrigger>
                <SelectContent id="type">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* //!Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
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
            {/* //!Subcategory */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subcategory" className="text-right">
                Subcategory
              </Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent id="subcategory">
                  {subcategories.map((subcategory) => {
                    return (
                      <SelectItem value={subcategory.name} key={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {/* //!Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-fit justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "dd/MM/yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDay) => {
                      if (!selectedDay) return;
                      setDate(selectedDay);
                    }}
                    initialFocus
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleAddAndNew} variant="outline">
              Add & New
            </Button>
            <Button type="submit" onClick={handleCreateTransaction}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateExpense;
