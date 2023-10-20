import CreateCategory from "@/components/pages/category/CreateCategory";
import { db } from "@/db/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFormatedDate } from "@/lib/utils";
import { useAccount } from "@/components/pages/shared/AccountContext";

type Props = {};

function Category({}: Props) {
  const { account } = useAccount();

  const categories = useLiveQuery(() => {
    return db.categories.where("account").equals(account.name).toArray();
  }, [account]);

  if (!categories) {
    return "Loading...";
  }
  return (
    <div>
      <div className="w-full flex justify-end">
        <div className="mr-10">
          <CreateCategory />
        </div>
      </div>
      <div>
        <Table>
          <TableCaption>Categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, i) => {
              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.type}</TableCell>
                  <TableCell>
                    {getFormatedDate(new Date(category.createdAt))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Category;
