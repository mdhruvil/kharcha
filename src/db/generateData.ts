import { format } from "date-fns";
import { db } from "./dexie";

function randomDateFromInterval(
  min: number = parseInt(format(new Date(2020, 1, 1), "ddMMyyyy")),
  max: number = parseInt(format(new Date(), "ddMMyyyy"))
) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(startDate = new Date(2020, 1, 1), endDate = new Date()) {
  // Convert the start and end dates to timestamps
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  // Generate a random timestamp between the two timestamps
  const randomTimestamp =
    startTimestamp + Math.random() * (endTimestamp - startTimestamp);

  // Create a new Date object from the random timestamp
  const randomDate = new Date(randomTimestamp);

  return randomDate;
}

export const generateData = () => {
  // Define your data
  const transactions = [];
  const categories = [];
  const subcategories = [];
  const accounts = [];

  // Generate sample data
  // for (let k = 0; k < 3; k++) {
  //   const account = {
  //     name: `Account ${k}`,
  //     createdAt: randomDate(),
  //   };
  //   accounts.push(account);
  // }

  for (let i = 40; i <= 60; i++) {
    const category = {
      type: Math.random() < 0.5 ? "expense" : "income", // or 'income' as needed
      name: `Category ${i}`,
      createdAt: randomDate(),
      account: "Account 2",
    };
    categories.push(category);

    for (let j = 1; j <= 2; j++) {
      const subcategory = {
        type: Math.random() < 0.5 ? "expense" : "income", // or 'income' as needed
        category: category.name,
        name: `Subcategory ${i}${j}`,
        createdAt: randomDate(),
        account: "Account 2",
      };
      subcategories.push(subcategory);
    }
  }

  for (let i = 201; i <= 300; i++) {
    const transaction = {
      name: `Transaction ${i}`,
      amount: Math.floor(Math.random() * 10000), // Generate a random amount
      createdAt: randomDate(),
      category: categories[Math.floor(Math.random() * categories.length)].name,
      subcategory:
        subcategories[Math.floor(Math.random() * subcategories.length)].name,
      type: Math.random() < 0.5 ? "expense" : "income", // Randomly choose 'expense' or 'income'
      method: ["cash", "upi", "bank transfer", "other"][
        Math.floor(Math.random() * 4)
      ], // Randomly choose a method
      account: "Account 2",
    };
    transactions.push(transaction);
  }

  // Insert data into the database
  db.transaction(
    "rw",
    db.transactions,
    db.categories,
    db.subcategories,

    async () => {
      await db.transactions.bulkAdd(transactions);
      await db.categories.bulkAdd(categories);
      await db.subcategories.bulkAdd(subcategories);
    }
  )
    .then(() => {
      console.log("Data added to IndexedDB successfully.");
    })
    .catch((err) => {
      console.error("Error adding data to IndexedDB:", err);
    });
};
