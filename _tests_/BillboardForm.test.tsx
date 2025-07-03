import BillboardForm from "@/app/(dashboard)/billboards/[billboardId]/components/BillboardForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const user = userEvent.setup();
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("BillboardForm", () => {
  it("renders all inputs", () => {
    render(<BillboardForm initialData={null} />);
    expect(screen.getByPlaceholderText(/billboard label/i)).toBeInTheDocument();
    expect(screen.getByText(/upload an image/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create billboard/i }))
      .toBeInTheDocument;
  });
  it("validates required fields", () => {
    mockedAxios.post.mockResolvedValue({});
    render(<BillboardForm initialData={null} />);
    user.click(screen.getByRole("button", { name: /create billboard/i }));
    expect(axios.post).not.toHaveBeenCalled();
  });
  it("submits form and calls onSubmit", async () => {
    mockedAxios.post.mockResolvedValue({});

    render(
      <BillboardForm
        initialData={null}
        defaultImage={
          "https://res.cloudinary.com/dup1qshie/image/upload/v1744073687/uqik1i0mcsgwywtisbqi.png"
        }
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/billboard label/i), {
      target: { value: "billboard 1" },
    });

    const submitBtn = screen.getByRole("button", { name: /create billboard/i });
    await user.click(submitBtn);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/billboards"),
        expect.objectContaining({
          label: expect.any(String),
          imageUrl:
            "https://res.cloudinary.com/dup1qshie/image/upload/v1744073687/uqik1i0mcsgwywtisbqi.png",
        })
      );
    });
  });
});
