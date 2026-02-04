export class DrawerUtils {
  static toggle(open?: boolean) {
    const toggle = document.getElementById("drawer-toggle") as HTMLInputElement;
    if (toggle) {
      toggle.checked = open ?? !toggle.checked;
    }
  }
}
