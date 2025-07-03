import ColorForm from "@/app/(dashboard)/colors/[colorId]/components/ColorForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const user = userEvent.setup();
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ColorForm", () => {
  it("renders all inputs", () => {
    render(<ColorForm initialData={null}></ColorForm>);
    expect(screen.getByPlaceholderText(/color name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/color value/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create color/i }));
  });
  it("validates required fields", () => {
    mockedAxios.post.mockResolvedValue({});
    render(<ColorForm initialData={null}></ColorForm>);
    user.click(screen.getByRole("button", { name: /create color/i }));
    expect(axios.post).not.toHaveBeenCalled();
  });
  it("submits form and calls onSubmit", async () => {
    mockedAxios.post.mockResolvedValue({});
    render(<ColorForm initialData={null}></ColorForm>);

    // define name
    fireEvent.change(screen.getByPlaceholderText(/color name/i), {
      target: {
        value: "magenta",
      },
    });
    // define value
    fireEvent.change(screen.getByPlaceholderText(/color value/i), {
      target: {
        value: "#ff00ff",
      },
    });

    // submit
    const submitBtn = screen.getAllByText(/create color/i)[1];
    await user.click(submitBtn);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/colors"),
        expect.objectContaining({
          name: expect.any(String),
          value: expect.any(String),
        })
      );
    });
  });
});
