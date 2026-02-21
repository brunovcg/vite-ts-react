import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button.component";

vi.mock("@/locales", () => ({
  useDictionary: (locale: Record<string, Record<string, string>>) => locale?.enUS ?? {},
  locales: {
    create: <T,>(locale: T) => locale,
    getText: ({ key, locale }: { key: string; locale: Record<string, Record<string, string>> }) => locale?.enUS?.[key] ?? key,
  },
}));

describe("components/Button", () => {
  it("should render children text", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("should be disabled when loading", () => {
    render(<Button loading>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("should show loading message when loading", () => {
    render(
      <Button loading loadingMessage='Saving...'>
        Submit
      </Button>,
    );

    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(screen.queryByText("Submit")).not.toBeInTheDocument();
  });

  it("should show default loading message when loading without custom message", () => {
    render(<Button loading>Submit</Button>);

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("should apply variant class", () => {
    render(<Button variant='filled'>Filled</Button>);

    const button = screen.getByRole("button");
    expect(button.className).toContain("variant-filled");
  });

  it("should default to regular variant", () => {
    render(<Button>Default</Button>);

    const button = screen.getByRole("button");
    expect(button.className).toContain("variant-regular");
  });

  it("should forward additional HTML attributes", () => {
    render(<Button data-testid='custom-btn'>Click me</Button>);

    expect(screen.getByTestId("custom-btn")).toBeInTheDocument();
  });
});
