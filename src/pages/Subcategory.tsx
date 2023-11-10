import { useAccount } from "@/components/pages/shared/AccountContext";
import CreateSubcategory from "@/components/pages/subcategory/CreateSubcategory";
import { columns } from "@/components/pages/subcategory/columns";
import { DataTable } from "@/components/pages/subcategory/data-table";
import { db } from "@/db/dexie";
import { useLiveQuery } from "dexie-react-hooks";

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
        <DataTable columns={columns} data={subcategories} />
      </div>
    </div>
  );
}

export default SubCategory;
