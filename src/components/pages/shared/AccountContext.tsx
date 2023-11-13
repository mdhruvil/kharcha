import { Account, db } from "@/db/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

//@ts-expect-error
const AccountContext = createContext<{
  account: Account;
  accounts: Account[];
  setAccount: React.Dispatch<React.SetStateAction<Account | undefined>>;
}>();

export const AccountContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [account, setAccount] = useState<Account>();
  const accounts = useLiveQuery(() => {
    return db.accounts.toArray();
  });

  useEffect(() => {
    if (!accounts) return;
    if (!account) {
      setAccount(accounts[0]);
    }
    const clear = setTimeout(() => {
      if (accounts.length === 0) {
        let show = true;
        let name;
        while (show) {
          name = prompt("Enter account name ");
          if (name) {
            show = false;
          }
        }
        if (!name) {
          return alert("Something Went Wrong please refresh the page");
        }
        db.accounts.add({
          name: name,
          createdAt: new Date(),
        });
      }
    }, 500);
    return () => {
      clearTimeout(clear);
    };
  }, [accounts]);

  if (!account || !accounts) {
    return "Loading";
  }

  return (
    <AccountContext.Provider value={{ account, accounts, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  return useContext(AccountContext);
};
