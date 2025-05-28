import prismadb from "@/lib/prismadb";

export const getProductsInStock = async () => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: process.env.STORE_ID,
      isArchived: false,
    },
    include: {
      units: true,
    },
  });

  const productsInStock = products.filter((product) => {
    const availableUnits = product.units.filter((unit) => !unit.isArchived);
    return availableUnits.length > 0;
  });

  return productsInStock.length;
};
