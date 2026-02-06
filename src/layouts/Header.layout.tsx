// import { Icon } from "@/components/icon/Icon";
import "@/components/button-icon/ButtonIcon.css";
import { ButtonIcon } from "@/components/button-icon/ButtonIcon";
import { DrawerUtils } from "./drawer/drawer.utils";

export function Header() {
  return (
    <header css={["display-flex", "align-center", "border-bottom", "padding-inline-xl", "padding-block-md", "gap-lg"]} data-component='Header'>
      <ButtonIcon icon='menu' color='primary' className='mobile-only' aria-label='Open menu' onClick={() => DrawerUtils.toggle()} />
      <h1>Header</h1>
    </header>
  );
}
