// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY // المفتاح السري
// );


// export async function POST(req) {
//   const formData = await req.formData();
//   const file = formData.get("file");

//   if (!file) {
//     return Response.json({ error: "لم يتم رفع أي ملف" }, { status: 400 });
//   }

//   // اسم الملف في التخزين
//   const fileName = `${Date.now()}_${file.name}`;

//   // رفع الملف إلى bucket باسم "products"
//   const { data, error } = await supabase.storage
//     .from("products")
//     .upload(fileName, file, {
//       cacheControl: "3600",
//       upsert: false,
//     });

//   if (error) {
//     console.error(error);
//     return Response.json({ error: "فشل رفع الصورة" }, { status: 500 });
//   }

//   // استخراج رابط الصورة بعد الرفع
//   const { data: publicUrl } = supabase.storage
//     .from("products")
//     .getPublicUrl(fileName);

//   return Response.json({ url: publicUrl.publicUrl });
// }
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // يستخدم المفتاح الآمن هنا فقط
);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images');
    
    const uploadedUrls = [];

    for (const file of files) {
      const fileName = `products/${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      
      // الرفع باستخدام المفتاح الآمن
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      uploadedUrls.push(data.publicUrl);
    }

    return new Response(JSON.stringify(uploadedUrls), { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
  }
}