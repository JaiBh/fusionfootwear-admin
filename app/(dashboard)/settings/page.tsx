import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import SettingsForm from "./components/SettingsForm";
import prismadb from "@/lib/prismadb";

async function SettingsPage() {
  const store = await prismadb.store.findFirst();

  return (
    <Container>
      <PageTitle title="Settings" desc="Manage store preferences"></PageTitle>
      <SettingsForm store={store}></SettingsForm>
    </Container>
  );
}
export default SettingsPage;
