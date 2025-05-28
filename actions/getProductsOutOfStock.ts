import prismadb from "@/lib/prismadb";

export const getProductsOutOfStock = async () => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: process.env.STORE_ID,
      isArchived: false,
    },
    include: {
      units: true,
    },
  });

  const productsOutOfStock = products.filter((product) => {
    const availableUnits = product.units.filter((unit) => !unit.isArchived);
    return availableUnits.length < 1;
  });

  return productsOutOfStock.length;
};
