import { Dialog } from "@/dialogs/Dialog";
import { useDictionary } from "@/locales";
import { userPreferencesDialogLocale } from "./UserPreferences.dialog.locales";
import { createTabs } from "@/components/tabs/createTabs";
import { UserPreferencesLanguage } from "./components/UserPreferencesLanguage";
import type { Css } from "@/runtime/css.types";

const Tabs = createTabs<"user" | "languages">();

export function UserPreferencesDialog() {
  const dictionary = useDictionary(userPreferencesDialogLocale);

  const tabCss: Css[] = ["flex-1", "display-flex", "padding-lg"];

  return (
    <Dialog dialogId='UserPreferencesDialog' heading={dictionary.title} width='lg' css={["min-height-500px"]}>
      <Tabs
        tabs={[
          { label: "User", id: "user" },
          {
            label: "Languages",
            id: "languages",
          },
        ]}
        id='UserPreferencesDialogMenu'
        orientation='vertical'
      >
        <div css={["display-flex", "flex-row", "flex-1"]}>
          <Tabs.Nav css={["width-150px", "padding-lg"]} />
          <Tabs.Item id='user' css={tabCss}>
            user
          </Tabs.Item>
          <Tabs.Item id='languages' css={tabCss}>
            <UserPreferencesLanguage />
          </Tabs.Item>
        </div>
      </Tabs>
      <Dialog.Footer>
        <Dialog.Close> {dictionary.close}</Dialog.Close>
      </Dialog.Footer>
    </Dialog>
  );
}
