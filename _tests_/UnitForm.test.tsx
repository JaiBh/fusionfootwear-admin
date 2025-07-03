import { mockClientProduct, mockColor, mockSize } from "@/_mocks_/data";
import UnitForm from "@/app/(dashboard)/units/[unitId]/components/UnitForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const user = userEvent.setup();
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UnitForm", () => {
  it("renders all inputs", () => {
    render(
      <UnitForm
        initialData={null}
        products={[{ ...mockClientProduct, color: mockColor }]}
        sizes={[mockSize]}
      ></UnitForm>
    );

    expect(screen.getByLabelText(/product/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/number of units to add/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Archived/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create unit\(s\)/i })
    ).toBeInTheDocument();
  });

  it("validates required fields", () => {
    mockedAxios.post.mockResolvedValue({});
    render(
      <UnitForm
        initialData={null}
        products={[{ ...mockClientProduct, color: mockColor }]}
        sizes={[mockSize]}
      ></UnitForm>
    );

    user.click(screen.getByRole("button", { name: /create unit\(s\)/i }));
    expect(axios.post).not.toHaveBeenCalled();
  });
  it("submits form and calls onSubmit", async () => {
    mockedAxios.post.mockResolvedValue({});
    render(
      <UnitForm
        initialData={null}
        products={[{ ...mockClientProduct, color: mockColor }]}
        sizes={[mockSize]}
      ></UnitForm>
    );

    // select product
    const productSelect = screen.getByLabelText(/product/i);
    await userEvent.click(productSelect);
    // use keyboard to select
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Enter]");

    await waitFor(() => expect(productSelect).toHaveTextContent(/product a/i));

    // select size
    const sizeSelect = screen.getByLabelText(/size/i);
    await userEvent.click(sizeSelect);
    // use keyboard to select
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Enter]");

    await waitFor(() => expect(sizeSelect).toHaveTextContent(/size a/i));

    // submit
    const submitBtn = screen.getByRole("button", {
      name: /create unit\(s\)/i,
    });
    await user.click(submitBtn);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/units"),
        expect.objectContaining({
          productId: expect.any(String),
          sizeId: expect.any(String),
          quantity: expect.any(Number),
          isArchived: expect.any(Boolean),
        })
      );
    });
  });
});
