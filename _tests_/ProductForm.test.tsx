import {
  mockCategoryA,
  mockCategoryB,
  mockClientProduct,
  mockColor,
  mockImage,
  mockProductLine,
} from "@/_mocks_/data";
import ProductForm from "@/app/(dashboard)/products/[productId]/components/ProductForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const user = userEvent.setup();
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProductForm", () => {
  it("renders all inputs", () => {
    render(
      <ProductForm
        initialData={{
          ...mockClientProduct,
          category: mockCategoryA,
          images: [mockImage],
        }}
        categories={[]}
        colors={[]}
        productLines={[]}
      />
    );
    expect(screen.getByLabelText(/Product Line/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Product name/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Type your description here./i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Price \(dollars\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Archived/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload an image/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save changes/i })
    ).toBeInTheDocument();
  });

  it("validates required fields", () => {
    mockedAxios.post.mockResolvedValue({});

    render(
      <ProductForm
        initialData={null}
        colors={[]}
        categories={[]}
        productLines={[]}
      ></ProductForm>
    );
    user.click(screen.getByRole("button", { name: /create product/i }));
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("submits form and calls onSubmit", async () => {
    mockedAxios.post.mockResolvedValue({});

    render(
      <ProductForm
        initialData={null}
        colors={[mockColor]}
        categories={[mockCategoryA]}
        productLines={[{ ...mockProductLine, category: mockCategoryB }]}
        defaultImages={[
          {
            url: "https://res.cloudinary.com/dup1qshie/image/upload/v1744073687/uqik1i0mcsgwywtisbqi.png",
          },
        ]}
      ></ProductForm>
    );

    // select product line
    const productLineSelect = screen.getByLabelText(/product line/i);
    await userEvent.click(productLineSelect);
    // use keyboard to select
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Enter]");

    await waitFor(() =>
      expect(productLineSelect).toHaveTextContent(/product line a/i)
    );

    // select color
    const colorSelect = screen.getByLabelText(/color/i);
    await userEvent.click(colorSelect);
    // use keyboard to select
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Enter]");

    await waitFor(() => expect(colorSelect).toHaveTextContent(/color a/i));

    // define description
    fireEvent.change(
      screen.getByPlaceholderText(/Type your description here./i),
      {
        target: {
          value: "description description description description description",
        },
      }
    );

    // define price
    fireEvent.change(screen.getByLabelText(/Price \(dollars\)/i), {
      target: { value: 99 },
    });

    // submit
    const submitBtn = screen.getByRole("button", { name: /create product/i });
    await user.click(submitBtn);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/products"),
        expect.objectContaining({
          name: expect.any(String),
          price: 99,
          productLineId: expect.any(String),
          desc: expect.any(String),
          categoryId: expect.any(String),
          department: expect.any(String),
          colorId: expect.any(String),
          isArchived: expect.any(Boolean),
          isFeatured: expect.any(Boolean),
          images: [
            {
              url: "https://res.cloudinary.com/dup1qshie/image/upload/v1744073687/uqik1i0mcsgwywtisbqi.png",
            },
          ],
        })
      );
    });
  });
});
