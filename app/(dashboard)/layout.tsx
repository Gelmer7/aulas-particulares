import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
