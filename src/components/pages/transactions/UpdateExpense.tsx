import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { db, type Transaction } from "@/db/dexie";
import { cn, handleInvalidMsg } from "@/lib/utils";
import { format } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { CalendarIcon } from "lucide-react";
import { ReactNode, useRef, useState } from "react";

type Props = {
  original: Transaction;
  trigger: ReactNode;
};

function UpdateExpense({ original, trigger }: Props) {
  const {
    id,
    name,
    amount,
    category,
    createdAt,
    method,
    subcategory,
    type,
    description,
  } = original;
  const [open, setOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const [selectedType, setSelectedType] = useState(type);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedSubCategory, setSelectedSubCategory] = useState(subcategory);
  const [date, setDate] = useState(createdAt);

  const categories = useLiveQuery(() => {
    return db.categories.where("type").equals(selectedType).toArray();
  }, [selectedType]);

  const subcategories = useLiveQuery(() => {
    return db.subcategories
      .where("category")
      .equals(selectedCategory)
      .toArray();
  }, [selectedCategory]);

  const updateTransactionRecord = async () => {
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
    //@ts-ignore
    await db.transactions.update(id, {
      name,
      type,
      category,
      method,
      amount: +amount,
      createdAt: date,
      subcategory,
      description,
    });
  };

  const handleUpdateTransaction = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // e.preventDefault();
    // console.log(formRef);
    // return;
    if (!formRef.current?.checkValidity()) {
      return;
    }
    e.preventDefault();
    await updateTransactionRecord();
    setOpen(false);
  };

  if (!categories || !subcategories) {
    return "Loading...";
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form ref={formRef}>
          <DialogHeader>
            <DialogTitle>Update Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* //! Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              {/* <Select
                value={selectedType}
                //@ts-ignore
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
                //@ts-ignore
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
                defaultValue={amount}
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
                defaultValue={name}
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
                defaultValue={description}
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
              <Select defaultValue={method}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={method} />
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
                  <SelectValue placeholder={selectedCategory} />
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
              <Select
                value={selectedSubCategory}
                onValueChange={setSelectedSubCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={selectedSubCategory} />
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
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleUpdateTransaction}>
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateExpense;
