import { describe, expect, test, vi } from "vitest";
import Button from "../Button";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Button", () => {
  test("rendered with correct children", () => {
    render(<Button>Login</Button>);
    const buttonElement = screen.getByText("Login");
    expect(buttonElement).toBeInTheDocument();
  });

  test("implement correct classes to button", () => {
    render(
      <Button size="lg" variant="primary">
        Submit
      </Button>
    );
    const buttonElement = screen.getByText("Submit");
    expect(buttonElement.className).toMatch(/_button_/);
    expect(buttonElement.className).toMatch(/_lg_/);
    expect(buttonElement.className).toMatch(/_primary_/);
  });

  test("Calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByText("Click Me");
    buttonElement.click();
    expect(handleClick).toHaveBeenCalled();
  });
});
