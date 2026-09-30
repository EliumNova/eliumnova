import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function Admin() {
  return <AdminApp />;
}
