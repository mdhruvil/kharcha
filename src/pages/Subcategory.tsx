import CreateSubcategory from "@/components/pages/subcategory/CreateSubcategory";
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

function SubCategory({}: Props) {
  const { account } = useAccount();
  const subcategories = useLiveQuery(() => {
    return db.subcategories.where("account").equals(account.name).toArray();
  }, [account]);

  if (!subcategories) {
    return "Loading...";
  }
  return (
    <div>
      <div className="w-full flex justify-end">
        <div className="mr-10">
          <CreateSubcategory />
        </div>
      </div>
      <div>
        <Table>
          <TableCaption>Subcategories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcategories.map((subcategory, i) => {
              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell>{subcategory.name}</TableCell>
                  <TableCell>{subcategory.category}</TableCell>
                  <TableCell>{subcategory.type}</TableCell>
                  <TableCell>
                    {getFormatedDate(new Date(subcategory.createdAt))}
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

export default SubCategory;
