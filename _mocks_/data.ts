import {
  Billboard,
  Category,
  Color,
  Image,
  Product,
  ProductLine,
  Size,
  Unit,
} from "@prisma/client";

export const mockBillboard: Billboard = {
  id: "id",
  label: "label",
  imageUrl: "img",
  storeId: "storeId",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCategoryA: Category = {
  id: "id",
  name: "category a",
  department: "unisex",
  billboardFemaleId: null,
  billboardMaleId: null,
  storeId: "storeId",
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCategoryB: Category = {
  id: "id",
  name: "category b",
  department: "womens",
  billboardFemaleId: null,
  billboardMaleId: null,
  storeId: "storeId",
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockColor: Color = {
  id: "id",
  name: "color a",
  value: "value",
  storeId: "storeId",
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const mockSize: Size = {
  id: "id",
  name: "size a",
  department: "womens",
  value: "value",
  storeId: "storeId",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockProductLine: ProductLine = {
  id: "id",
  department: "womens",
  name: "product line a",
  categoryId: "catId",
  storeId: "storeId",
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockClientProduct: Omit<Product, "price"> & {
  price: number;
} = {
  id: "id",
  department: "womens",
  name: "product a",
  price: 99,
  productLineId: "pl_id",
  keywords: [],
  storeId: "storeId",
  categoryId: "catId",
  colorId: "colId",
  desc: "description description description description description",
  isFeatured: false,
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockImage: Image = {
  id: "id",
  url: "https://res.cloudinary.com/dup1qshie/image/upload/v1744073687/uqik1i0mcsgwywtisbqi.png",
  productId: "prod_id",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUnit: Unit = {
  id: "id",
  storeId: "storeId",
  productId: "prod_id",
  sizeId: "size_id",
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};
