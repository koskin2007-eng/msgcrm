import { redirect } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { InboxWorkspace } from "../../components/inbox/InboxWorkspace";
import { fetchAuthSession } from "../../lib/auth-server";
import { fetchInboxBootstrap } from "../../lib/inbox-server";

export default async function InboxPage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  const inbox = await fetchInboxBootstrap(session.company.id);

  return (
    <AppLayout session={session}>
      <InboxWorkspace
        accounts={inbox.accounts}
        backendConversationIds={inbox.backendConversationIds}
        conversations={inbox.conversations}
        listings={inbox.listings}
        messages={inbox.messages}
      />
    </AppLayout>
  );
}
