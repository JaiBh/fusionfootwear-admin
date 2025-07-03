import { mockBillboard, mockCategoryA } from "@/_mocks_/data";
import CategoryForm from "@/app/(dashboard)/categories/[categoryId]/components/CategoryForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const user = userEvent.setup();
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("CategoryForm", () => {
  it("renders all inputs", () => {
    render(
      <CategoryForm initialData={mockCategoryA} billboards={[mockBillboard]} />
    );
    expect(screen.getByPlaceholderText(/category name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/billboard for/i)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(/billboard for/i)[1]).toBeInTheDocument();
    expect(screen.getByLabelText(/Archived/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save changes/i })
    ).toBeInTheDocument();
  });
  it("validates required fields", () => {
    mockedAxios.post.mockResolvedValue({});
    render(<CategoryForm initialData={null} billboards={[mockBillboard]} />);
    user.click(screen.getByRole("button", { name: /create category/i }));
    expect(axios.post).not.toHaveBeenCalled();
  });
  it("submits form and calls onSubmit", async () => {
    mockedAxios.post.mockResolvedValue({});
    render(
      <CategoryForm
        initialData={null}
        billboards={[mockBillboard]}
      ></CategoryForm>
    );

    // define name
    fireEvent.change(screen.getByPlaceholderText(/category name/i), {
      target: { value: "category 1" },
    });

    // select department
    const departmentSelect = screen.getByLabelText(/department/i);
    await userEvent.click(departmentSelect);
    // use keyboard to select
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Enter]");
    await waitFor(() => expect(departmentSelect).toHaveTextContent(/unisex/i));

    // select mens billboard
    const mensBillboardSelect = screen.getAllByLabelText(/billboard for/i)[0];
    await userEvent.click(mensBillboardSelect);
    // use keyboard to select
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Enter]");
    await waitFor(() =>
      expect(mensBillboardSelect).toHaveTextContent(/label/i)
    );

    // select womens billboard
    const womensBillboardSelect = screen.getAllByLabelText(/billboard for/i)[1];
    await userEvent.click(womensBillboardSelect);
    // use keyboard to select
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Enter]");
    await waitFor(() =>
      expect(womensBillboardSelect).toHaveTextContent(/label/i)
    );

    const submitBtn = screen.getByRole("button", { name: /create category/i });
    await user.click(submitBtn);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/categories"),
        expect.objectContaining({
          name: expect.any(String),
          department: expect.any(String),
          isArchived: expect.any(Boolean),
          billboardMaleId: expect.any(String),
          billboardFemaleId: expect.any(String),
        })
      );
    });
  });
});
