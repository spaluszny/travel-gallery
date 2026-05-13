// app/api/photos/update/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request) {
  try {
    const { photoId, fields } = await req.json();

    if (!photoId || !fields) {
      return NextResponse.json(
        { error: "Missing photoId or fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("photos")
      .update(fields)
      .eq("photo_id", photoId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
  }
}