import type { Metadata } from "next";
import SafeWalkApp from "@/components/SafeWalkApp";

export const metadata: Metadata = {
  title: "SafeWalk — Map",
};

export default function AppPage() {
  return <SafeWalkApp />;
}
