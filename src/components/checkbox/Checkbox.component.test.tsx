import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "./Checkbox.component";

describe("components/Checkbox", () => {
  it("should render a checkbox input", () => {
    render(<Checkbox id='test-cb' aria-label='Test' />);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("should render with a label", () => {
    render(<Checkbox id='test-cb' label='Accept terms' />);

    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("should associate label with input via htmlFor", () => {
    render(<Checkbox id='terms' label='Accept terms' />);

    const input = screen.getByRole("checkbox");
    expect(input).toHaveAttribute("id", "terms");

    const label = input.closest("label");
    expect(label).toHaveAttribute("for", "terms");
  });

  it("should call onChange when clicked", () => {
    const onChange = vi.fn();
    render(<Checkbox id='test-cb' aria-label='Test' onChange={onChange} />);

    fireEvent.click(screen.getByRole("checkbox"));

    expect(onChange).toHaveBeenCalledOnce();
  });

  it("should render as radio when type is radio", () => {
    render(<Checkbox id='test-radio' type='radio' aria-label='Test' />);

    expect(screen.getByRole("radio")).toBeInTheDocument();
  });

  it("should default to checkbox type", () => {
    render(<Checkbox id='test-cb' aria-label='Test' />);

    const input = screen.getByRole("checkbox");
    expect(input).toHaveAttribute("type", "checkbox");
  });

  it("should support disabled state", () => {
    render(<Checkbox id='test-cb' aria-label='Test' disabled />);

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("should not render label text when label is not provided", () => {
    const { container } = render(<Checkbox id='test-cb' aria-label='Test' />);

    expect(container.querySelector(".label-text")).not.toBeInTheDocument();
  });

  it("should forward additional input props", () => {
    render(<Checkbox id='test-cb' aria-label='Test' name='agreement' value='yes' />);

    const input = screen.getByRole("checkbox");
    expect(input).toHaveAttribute("name", "agreement");
    expect(input).toHaveAttribute("value", "yes");
  });
});
