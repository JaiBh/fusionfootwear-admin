import { mockCategoryA, mockCategoryB } from "@/_mocks_/data";
import ProductLineForm from "@/app/(dashboard)/productLines/[productLineId]/components/ProductLineForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const user = userEvent.setup();
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProductLineForm", () => {
  it("renders all inputs", () => {
    render(
      <ProductLineForm
        initialData={null}
        categories={[mockCategoryA, mockCategoryB]}
      ></ProductLineForm>
    );

    expect(
      screen.getByPlaceholderText(/product line name/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Archived/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create product line/i })
    ).toBeInTheDocument();
  });
  it("validates required fields", () => {
    mockedAxios.post.mockResolvedValue({});
    render(
      <ProductLineForm
        initialData={null}
        categories={[mockCategoryA, mockCategoryB]}
      ></ProductLineForm>
    );

    user.click(screen.getByRole("button", { name: /create product line/i }));
    expect(axios.post).not.toHaveBeenCalled();
  });
  it("submits form and calls onSubmit", async () => {
    mockedAxios.post.mockResolvedValue({});
    render(
      <ProductLineForm
        initialData={null}
        categories={[mockCategoryA, mockCategoryB]}
      ></ProductLineForm>
    );

    // define name
    fireEvent.change(screen.getByPlaceholderText(/product line name/i), {
      target: {
        value: "Product Line A",
      },
    });

    // select category
    const categorySelect = screen.getByLabelText(/category/i);
    await userEvent.click(categorySelect);
    // use keyboard to select
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Enter]");

    await waitFor(() =>
      expect(categorySelect).toHaveTextContent(/category a/i)
    );

    // select department
    const departmentSelect = screen.getByLabelText(/department/i);
    await userEvent.click(departmentSelect);
    // use keyboard to select
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Enter]");

    await waitFor(() => expect(departmentSelect).toHaveTextContent(/womens/i));

    // submit
    const submitBtn = screen.getByRole("button", {
      name: /create product line/i,
    });
    await user.click(submitBtn);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/productLines"),
        expect.objectContaining({
          name: expect.any(String),
          categoryId: expect.any(String),
          department: expect.any(String),
          isArchived: expect.any(Boolean),
        })
      );
    });
  });
});
