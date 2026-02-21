import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chip } from "./Chip.component";

describe("components/Chip", () => {
  it("should render children text", () => {
    render(<Chip color='primary'>Active</Chip>);

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("should have role=status for screen readers", () => {
    render(<Chip color='success'>Done</Chip>);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Done");
  });

  it("should render as a span element", () => {
    render(<Chip color='primary'>Tag</Chip>);

    const chip = screen.getByRole("status");
    expect(chip.tagName).toBe("SPAN");
  });

  it("should set data-component attribute", () => {
    render(<Chip color='warning'>Alert</Chip>);

    const chip = screen.getByRole("status");
    expect(chip).toHaveAttribute("data-component", "Chip");
  });

  it.each(["primary", "error", "warning", "success"] as const)("should render with %s color", (color) => {
    render(<Chip color={color}>{color}</Chip>);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render complex children", () => {
    render(
      <Chip color='primary'>
        <span data-testid='icon'>*</span>
        Active
      </Chip>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});
