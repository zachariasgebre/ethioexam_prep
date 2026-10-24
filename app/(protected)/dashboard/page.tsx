import { verifySession } from "@/lib/dal";
import { DashboardProgress } from "@/components/dashboard-progress";

export default async function DashboardPage() {
  const { user } = await verifySession();
  return (
    <DashboardProgress
      userId={user.id}
      userName={user.name}
      hasPaid={user.hasPaid === true}
      isAdmin={user.role === "admin"}
    />
  );
}
