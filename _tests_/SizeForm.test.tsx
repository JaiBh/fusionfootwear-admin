import SizeForm from "@/app/(dashboard)/sizes/[sizeId]/components/SizeForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const user = userEvent.setup();
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SizeForm", () => {
  it("renders all inputs", () => {
    render(<SizeForm initialData={null}></SizeForm>);
    expect(screen.getByPlaceholderText(/size name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/size value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create size/i }));
  });
  it("validates required fields", () => {
    mockedAxios.post.mockResolvedValue({});
    render(<SizeForm initialData={null}></SizeForm>);
    user.click(screen.getByRole("button", { name: /create size/i }));
    expect(axios.post).not.toHaveBeenCalled();
  });
  it("submits form and calls onSubmit", async () => {
    mockedAxios.post.mockResolvedValue({});
    render(<SizeForm initialData={null}></SizeForm>);

    // define name
    fireEvent.change(screen.getByPlaceholderText(/size name/i), {
      target: {
        value: "99",
      },
    });
    // define value
    fireEvent.change(screen.getByPlaceholderText(/size value/i), {
      target: {
        value: "99",
      },
    });

    // select department
    const departmentSelect = screen.getByLabelText(/department/i);
    await userEvent.click(departmentSelect);
    // use keyboard to select
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Enter]");

    await waitFor(() => expect(departmentSelect).toHaveTextContent(/womens/i));

    // submit
    const submitBtn = screen.getByRole("button", { name: /create size/i });
    await user.click(submitBtn);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/sizes"),
        expect.objectContaining({
          name: expect.any(String),
          value: expect.any(String),
          department: expect.any(String),
        })
      );
    });
  });
});
