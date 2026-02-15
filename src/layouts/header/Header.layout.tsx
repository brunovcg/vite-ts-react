// import { Icon } from "@/components/icon/Icon";
import "@/components/button-icon/ButtonIcon.css";
import { ButtonIcon } from "@/components/button-icon/ButtonIcon";
import { DrawerUtils } from "../drawer/drawer.utils";
import { useDictionary } from "@/locales";
import { headerLocale } from "./Header.layout.locales";
import { DropdownMenu } from "@/components/dropdown-menu/DropdownMenu";
import { useSession } from "@/context/session-context/useSession";
import { dialogController } from "@/dialogs/Dialog.controller";
import { Avatar } from "@/components/avatar/Avatar";

export function Header() {
  const dictionary = useDictionary(headerLocale);

  const { logout } = useSession();

  return (
    <header css={["display-flex", "align-center", "justify-between", "border-bottom", "padding-inline-xl", "padding-block-md", "gap-lg"]} data-component='Header'>
      <div css={["display-flex", "align-center", "gap-lg"]}>
        <ButtonIcon icon='menu' color='primary' className='mobile-only' aria-label={dictionary.openMenu} onClick={() => DrawerUtils.toggle()} />
        <h1>Header</h1>
      </div>

      <DropdownMenu
        options={[
          { label: dictionary.preferences, onClick: () => dialogController.open("UserPreferencesDialog"), icon: "userSettings", color: "primary" },
          { label: dictionary.logout, onClick: logout, icon: "logout", color: "error" },
        ]}
        trigger={{ custom: <Avatar /> }}
      />
    </header>
  );
}
