//@ts-nocheck

import React, { useRef } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { db } from "./hooks/dexie";
import { useLiveQuery } from "dexie-react-hooks";

function App() {
  const formRef = useRef<HTMLFormElement>(null);
  const accformRef = useRef<HTMLFormElement>(null);
  const catformRef = useRef<HTMLFormElement>(null);

  const categories = useLiveQuery(() => {
    return db.categories.toArray();
  });

  const accounts = useLiveQuery(() => {
    return db.accounts.toArray();
  });

  const handleInvalidMsg = (
    e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>,
    msg: string = "This field is required"
  ) => {
    (e.target as EventTarget & HTMLInputElement).setCustomValidity(msg);
  };

  const handleCreateAccount = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!accformRef.current?.checkValidity()) {
      return;
    }
    e.preventDefault();
    const name = (accformRef.current[0] as EventTarget & HTMLInputElement)
      .value;
    const description = (
      accformRef.current[1] as EventTarget & HTMLTextAreaElement
    ).value;
    const id = await db.accounts.add({
      name,
      description,
      createdAt: new Date().toISOString(),
    });
    console.log("Acc added with id " + id);
  };

  const handleCreateCategory = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!catformRef.current?.checkValidity()) {
      return;
    }
    e.preventDefault();
    // console.log(catformRef);
    const name = (catformRef.current[0] as EventTarget & HTMLInputElement)
      .value;
    const description = (
      catformRef.current[1] as EventTarget & HTMLTextAreaElement
    ).value;
    const id = await db.categories.add({
      name,
      description,
      createdAt: new Date().toISOString(),
    });
    console.log("Acc added with id " + id);
  };

  if (!categories || !accounts) return;
  return (
    <>
      {/* //!Transactions */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
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
                  required
                  onInvalid={(e) => {
                    handleInvalidMsg(e, "Please Enter Description");
                  }}
                  onInput={(e) => {
                    handleInvalidMsg(e, "");
                  }}
                />
              </div>
              {/* //!Category */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select defaultValue={categories[0].id?.toString()}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={categories[0].name} />
                  </SelectTrigger>
                  <SelectContent id="category">
                    {categories.map((category) => {
                      return (
                        <SelectItem
                          value={category.id!.toString()}
                          key={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              {/* //!Account */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select defaultValue={accounts[0].id?.toString()}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={accounts[0].name} />
                  </SelectTrigger>
                  <SelectContent id="category">
                    {accounts.map((account) => {
                      return (
                        <SelectItem
                          value={account.id!.toString()}
                          key={account.id}
                        >
                          {account.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                onClick={(e) => {
                  if (!formRef.current?.checkValidity()) {
                    return;
                  }
                  e.preventDefault();
                  console.log(formRef);
                }}
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* //!Accounts */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Create Accounts</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form ref={accformRef}>
            <DialogHeader>
              <DialogTitle>Add Account</DialogTitle>
              <DialogDescription>
                Add details of Account here. Click add when you are done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* //! name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Account name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  required
                  onInvalid={(e) => {
                    handleInvalidMsg(e, "Please Enter Account name");
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
              <Button type="submit" onClick={handleCreateAccount}>
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* //!Category */}
      <Dialog>
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

export default App;
