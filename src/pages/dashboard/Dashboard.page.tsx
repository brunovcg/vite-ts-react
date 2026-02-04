import { Outlet } from "react-router-dom";
import { Drawer } from "../../layouts/drawer/Drawer.layout";
import { Header } from "../../layouts/Header.layout";

export function Dashboard() {
  return (
    <div className='display-flex column height-full overflow-hidden' data-component='Dashboard'>
      <Header />
      <div className='display-flex row flex-1 relative overflow-hidden'>
        <input type='checkbox' id='drawer-toggle' className='drawer-toggle' />
        <Drawer />
        <main className='flex-1 padding-lg overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
