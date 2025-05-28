import prismadb from "@/lib/prismadb";

async function StoreName() {
  const store = await prismadb.store.findUnique({
    where: {
      id: process.env.STORE_ID,
    },
  });

  return <div className="max-w-60 font-bold cursor-default">{store?.name}</div>;
}
export default StoreName;
