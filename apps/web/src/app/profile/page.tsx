import { redirect } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchAuthSession } from "../../lib/auth-server";

export default async function ProfilePage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          description="Здесь можно изменить данные владельца аккаунта и компании."
          title="Личные данные"
        />
        <ProfileForm session={session} />
      </section>
    </AppLayout>
  );
}
