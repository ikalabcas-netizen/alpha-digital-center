import { SignoutClient } from "./signout-client";
import { safeCallback } from "@/lib/redirect";

export const dynamic = "force-dynamic";

export default async function SignoutPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const target = safeCallback(callbackUrl);
  return <SignoutClient callbackUrl={target} />;
}
