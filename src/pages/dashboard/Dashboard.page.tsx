import { Outlet } from "react-router-dom";
import { Drawer } from "../../layouts/drawer/Drawer.layout";
import { Header } from "../../layouts/header/Header.layout";

export function Dashboard() {
  return (
    <div className='display-flex flex-column height-full overflow-hidden' data-component='Dashboard'>
      <Header />
      <div className='display-flex flex-row flex-1 relative overflow-hidden'>
        <input type='checkbox' id='drawer-toggle' className='drawer-toggle' />
        <Drawer />
        <main css={["flex-1", "padding-xl", "overflow-y-auto", "background-surface"]}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
