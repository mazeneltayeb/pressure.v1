// import { promises as fs } from "fs";
// import path from "path";

// const filePath = path.join(process.cwd(), "data", "articles.json");

// // 🟢 قراءة كل المقالات
// export async function GET() {
//   try {
//     const data = await fs.readFile(filePath, "utf8");
//     const articles = data ? JSON.parse(data) : [];
//     return new Response(JSON.stringify(articles), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify([]), { status: 200 });
//   }
// }

// // 🟢 إضافة مقال جديد
// export async function POST(req) {
//   try {
//     const newArticle = await req.json();

//     // ✅ التحقق من المدخلات
//     if (!newArticle.title || !Array.isArray(newArticle.sections)) {
//       return new Response(JSON.stringify({ error: "Invalid article format" }), {
//         status: 400,
//       });
//     }

//     const data = await fs.readFile(filePath, "utf8");
//     const articles = data ? JSON.parse(data) : [];

//     const newId = articles.length > 0 ? articles[articles.length - 1].id + 1 : 1;

//     // ✅ لو المستخدم مبعتش coverImage نضيف قيمة فاضية
//     const articleToSave = {
//       id: newId,
//       title: newArticle.title,
//       sections: newArticle.sections,
//       coverImage: newArticle.coverImage || "", // ✅ الصورة
//     };

//     articles.push(articleToSave);
//     await fs.writeFile(filePath, JSON.stringify(articles, null, 2));

//     return new Response(JSON.stringify(articleToSave), { status: 201 });
//   } catch (error) {
//     console.error("POST error:", error);
//     return new Response(JSON.stringify({ error: "Server error" }), {
//       status: 500,
//     });
//   }
// }

// // 🟡 تعديل مقال
// export async function PUT(req) {
//   try {
//     const updated = await req.json();

//     const data = await fs.readFile(filePath, "utf8");
//     const articles = data ? JSON.parse(data) : [];

//     const index = articles.findIndex((a) => a.id === updated.id);
//     if (index === -1)
//       return new Response(JSON.stringify({ error: "Article not found" }), {
//         status: 404,
//       });

//     // ✅ نحدّث القيم (بما فيهم الصورة)
//     articles[index] = {
//       ...articles[index],
//       ...updated,
//       coverImage: updated.coverImage || articles[index].coverImage || "",
//     };

//     await fs.writeFile(filePath, JSON.stringify(articles, null, 2));

//     return new Response(JSON.stringify(articles[index]), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: "Update failed" }), {
//       status: 500,
//     });
//   }
// }

// // 🔴 حذف مقال
// export async function DELETE(req) {
//   try {
//     const { id } = await req.json();

//     const data = await fs.readFile(filePath, "utf8");
//     const articles = data ? JSON.parse(data) : [];

//     const filtered = articles.filter((a) => a.id !== id);

//     await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));

//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: "Delete failed" }), {
//       status: 500,
//     });
//   }
// }

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // المفتاح السري من إعدادات Supabase
);

// ✅ إنشاء اتصال بـ Supabase
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// 🟢 قراءة كل المقالات
export async function GET() {
  try {
    const { data: articles, error } = await supabase.from("articles").select("*");

    if (error) throw error;

    return new Response(JSON.stringify(articles), { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify([]), { status: 200 });
  }
}

// 🟢 إضافة مقال جديد
export async function POST(req) {
  try {
    const newArticle = await req.json();

    if (!newArticle.title || !Array.isArray(newArticle.sections)) {
      return new Response(JSON.stringify({ error: "Invalid article format" }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          title: newArticle.title,
          sections: newArticle.sections,
          coverImage: newArticle.coverImage || "",
        },
      ])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data[0]), { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

// 🟡 تعديل مقال
export async function PUT(req) {
  try {
    const updated = await req.json();

    if (!updated.id) {
      return new Response(JSON.stringify({ error: "Missing article id" }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("articles")
      .update({
        title: updated.title,
        sections: updated.sections,
        coverImage: updated.coverImage || "",
      })
      .eq("id", updated.id)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data[0]), { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ error: "Update failed" }), {
      status: 500,
    });
  }
}

// 🔴 حذف مقال
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing article id" }), {
        status: 400,
      });
    }

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}

// import { createClient } from "@supabase/supabase-js";

// // 🟢 إنشاء عميل Supabase
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY // لازم تكون Service Role
// );

// // 🟢 جلب كل المقالات
// export async function GET() {
//   const { data, error } = await supabase.from("articles").select("*");

//   if (error) {
//     console.error("GET error:", error.message);
//     return new Response(JSON.stringify([]), { status: 500 });
//   }

//   return new Response(JSON.stringify(data || []), { status: 200 });
// }

// // 🟢 إضافة مقال جديد
// export async function POST(req) {
//   try {
//     const newArticle = await req.json();

//     const { data, error } = await supabase
//       .from("articles")
//       .insert([
//         {
//           title: newArticle.title,
//           coverImage: newArticle.coverImage || "",
//           sections: newArticle.sections || [],
//         },
//       ])
//       .select();

//     if (error) throw error;

//     return new Response(JSON.stringify(data[0]), { status: 201 });
//   } catch (error) {
//     console.error("POST error:", error.message);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

// // 🟡 تعديل مقال
// export async function PUT(req) {
//   try {
//     const updated = await req.json();

//     const { data, error } = await supabase
//       .from("articles")
//       .update({
//         title: updated.title,
//         coverImage: updated.coverImage || "",
//         sections: updated.sections || [],
//       })
//       .eq("id", updated.id)
//       .select();

//     if (error) throw error;

//     return new Response(JSON.stringify(data[0]), { status: 200 });
//   } catch (error) {
//     console.error("PUT error:", error.message);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

// // 🔴 حذف مقال
// export async function DELETE(req) {
//   try {
//     const { id } = await req.json();

//     const { error } = await supabase.from("articles").delete().eq("id", id);

//     if (error) throw error;

//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (error) {
//     console.error("DELETE error:", error.message);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

// import { createClient } from "@supabase/supabase-js";

// // 🧩 إنشاء اتصال بـ Supabase
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// // 🟢 قراءة جميع المقالات
// export async function GET() {
//   try {
//     const { data, error } = await supabase.from("articles").select("*").order("id", { ascending: true });
//     if (error) throw error;

//     return new Response(JSON.stringify(data || []), { status: 200 });
//   } catch (error) {
//     console.error("GET error:", error.message);
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }

// // 🟢 إضافة مقال جديد
// export async function POST(req) {
//   try {
//     const newArticle = await req.json();

//     if (!newArticle.title || !Array.isArray(newArticle.sections)) {
//       return new Response(JSON.stringify({ error: "Invalid article format" }), { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from("articles")
//       .insert([
//         {
//           title: newArticle.title,
//           coverImage: newArticle.coverImage || "",
//           sections: newArticle.sections,
//         },
//       ])
//       .select();

//     if (error) throw error;

//     return new Response(JSON.stringify(data[0]), { status: 201 });
//   } catch (error) {
//     console.error("POST error:", error.message);
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }

// // 🟡 تعديل مقال
// export async function PUT(req) {
//   try {
//     const updated = await req.json();

//     if (!updated.id) {
//       return new Response(JSON.stringify({ error: "Missing article ID" }), { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from("articles")
//       .update({
//         title: updated.title,
//         coverImage: updated.coverImage || "",
//         sections: updated.sections,
//       })
//       .eq("id", updated.id)
//       .select();

//     if (error) throw error;

//     return new Response(JSON.stringify(data[0]), { status: 200 });
//   } catch (error) {
//     console.error("PUT error:", error.message);
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }

// // 🔴 حذف مقال
// export async function DELETE(req) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return new Response(JSON.stringify({ error: "Missing article ID" }), { status: 400 });
//     }

//     const { error } = await supabase.from("articles").delete().eq("id", id);
//     if (error) throw error;

//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (error) {
//     console.error("DELETE error:", error.message);
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }



