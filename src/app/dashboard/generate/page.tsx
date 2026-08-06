"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GenerateCV() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/create?mode=ai");
  }, [router]);

  return null;
}
