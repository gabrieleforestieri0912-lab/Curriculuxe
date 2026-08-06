/* eslint-disable react-hooks/error-boundaries */
import Analyze from "@/components/Analyze";
import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

export default async function AnalyzeHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: doc, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !doc) {
      return notFound();
    }

    const safeData = JSON.parse(JSON.stringify(doc.data));

    return <Analyze initialResult={safeData} />;
  } catch (error) {
    console.error("Error fetching analysis", error);
    return notFound();
  }
}
