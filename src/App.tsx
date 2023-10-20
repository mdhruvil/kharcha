import { Outlet } from "react-router-dom";
import SideBar from "./components/pages/shared/SideBar";

type Props = {};

function App({}: Props) {
  return (
    <>
      <div className="container flex">
        <SideBar className="mt-5 pr-10 border-r"></SideBar>
        <div className="mt-5 ml-5 w-full">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}

export default App;
