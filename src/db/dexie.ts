import { Dexie, Table } from "dexie";

export interface Transaction {
  id?: number;
  name: string;
  amount: number;
  description?: string;
  createdAt: Date;
  category: string;
  subcategory: string;
  type: "expense" | "income";
  method: "cash" | "upi" | "bank transfer" | "other";
  account: string;
}

export interface Category {
  id?: number;
  type: "expense" | "income";
  name: string;
  description?: string;
  createdAt: number;
  account: string;
}

export interface Subcategory {
  id?: number;
  type: "expense" | "income";
  category: string;
  name: string;
  description?: string;
  createdAt: number;
  account: string;
}

export interface Account {
  id?: number;
  name: string;
  createdAt: Date;
}

export class DBClass extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;
  subcategories!: Table<Subcategory>;
  accounts!: Table<Account>;

  constructor() {
    super("Kharcha");
    this.version(1).stores({
      transactions:
        "++id,name,createdAt,category,account,type,amount,method,[account+type]",
      categories: "++id,name,createdAt,[account+type],type",
      subcategories: "++id,name,createdAt,type,[account+category],category",
      accounts: "++id,name,createdAt",
    });
  }
}

export const db = new DBClass();
