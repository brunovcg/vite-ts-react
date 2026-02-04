import { Icon } from "@/components/icon/Icon";
import "@/components/button-icon/ButtonIcon.css";

export function Header() {
  return (
    <header
      className='display-flex align-center border-bottom padding-md gap-lg'
      data-component='Header'
    >
      <label
        htmlFor='drawer-toggle'
        className='mobile-only padding-sm border-none background-transparent cursor-pointer display-flex align-center justify-center'
        aria-label='Open menu'
      >
        <div className='button-icon border-radius-circle padding-sm background-white cursor-pointer border-primary'>
          <Icon icon='menu' color='primary' />
        </div>
      </label>
      <h1>Header</h1>
    </header>
  );
}
