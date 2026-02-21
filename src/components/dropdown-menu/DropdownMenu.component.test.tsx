import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DropdownMenu } from "./DropdownMenu.component";

vi.mock("@/locales", () => ({
  useDictionary: (locale: Record<string, Record<string, string>>) => locale?.enUS ?? {},
  locales: {
    create: <T,>(locale: T) => locale,
    getText: ({ key, locale }: { key: string; locale: Record<string, Record<string, string>> }) => locale?.enUS?.[key] ?? key,
  },
}));

const defaultOptions = [
  { label: "Edit", onClick: vi.fn() },
  { label: "Delete", onClick: vi.fn(), color: "error" as const },
];

describe("components/DropdownMenu", () => {
  it("should render a trigger button with label", () => {
    render(<DropdownMenu options={defaultOptions} trigger={{ label: "Actions" }} />);

    expect(screen.getByRole("button", { name: "dropdown-trigger" })).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("should have aria-haspopup on trigger", () => {
    render(<DropdownMenu options={defaultOptions} trigger={{ label: "Actions" }} />);

    const trigger = screen.getByRole("button", { name: "dropdown-trigger" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  });

  it("should have aria-expanded=false initially", () => {
    render(<DropdownMenu options={defaultOptions} trigger={{ label: "Actions" }} />);

    const trigger = screen.getByRole("button", { name: "dropdown-trigger" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("should toggle aria-expanded on click", () => {
    render(<DropdownMenu options={defaultOptions} trigger={{ label: "Actions" }} />);

    const trigger = screen.getByRole("button", { name: "dropdown-trigger" });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("should render a menu with role=menu", () => {
    render(<DropdownMenu options={defaultOptions} trigger={{ label: "Actions" }} />);

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("should render menu items with role=menuitem", () => {
    render(<DropdownMenu options={defaultOptions} trigger={{ label: "Actions" }} />);

    const items = screen.getAllByRole("menuitem");
    expect(items).toHaveLength(2);
  });

  it("should call option onClick when menu item is clicked", () => {
    const editHandler = vi.fn();
    const options = [{ label: "Edit", onClick: editHandler }];

    render(<DropdownMenu options={options} trigger={{ label: "Actions" }} />);

    fireEvent.click(screen.getByRole("button", { name: "dropdown-trigger" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(editHandler).toHaveBeenCalledOnce();
  });

  it("should close menu after clicking an option", () => {
    render(<DropdownMenu options={defaultOptions} trigger={{ label: "Actions" }} />);

    const trigger = screen.getByRole("button", { name: "dropdown-trigger" });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("should hide options with hide=true", () => {
    const options = [
      { label: "Visible", onClick: vi.fn() },
      { label: "Hidden", onClick: vi.fn(), hide: true },
    ];

    render(<DropdownMenu options={options} trigger={{ label: "Actions" }} />);

    expect(screen.getByRole("menuitem", { name: "Visible" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "Hidden" })).not.toBeInTheDocument();
  });

  it("should disable options with disabled=true", () => {
    const options = [{ label: "Disabled action", onClick: vi.fn(), disabled: true }];

    render(<DropdownMenu options={options} trigger={{ label: "Actions" }} />);

    expect(screen.getByRole("menuitem", { name: "Disabled action" })).toBeDisabled();
  });

  it("should close on Escape key", () => {
    render(<DropdownMenu options={defaultOptions} trigger={{ label: "Actions" }} />);

    const trigger = screen.getByRole("button", { name: "dropdown-trigger" });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(trigger.closest("[data-component='DropdownMenu']")!, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("should support custom trigger", () => {
    render(<DropdownMenu options={defaultOptions} trigger={{ custom: <span data-testid='custom'>Custom trigger</span> }} />);

    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });
});
