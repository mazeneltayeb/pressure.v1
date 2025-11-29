

"use client";


import { createClient } from '@supabase/supabase-js';

// في الداشبورد استخدم المفتاح العام فقط
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // المفتاح العام فقط
);
import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";

export default function DashboardProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    images: [],
    video: "",
    youtube: "",
    article: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // 🟢 تحميل الفئات
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  // 🟢 تحميل المنتجات
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("فشل في تحميل المنتجات");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ أثناء تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // 🟢 فلترة حسب الفئة
  useEffect(() => {
    if (selectedCategory === "الكل") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  // 🟢 تحديث الفورم
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 رفع صور
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImageFiles(files);
    setFormData({ ...formData, images: urls });
  };



 
 const handleSubmit = async () => {
  if (!formData.name || !formData.price) {
    setMessage("⚠️ أدخل الاسم والسعر");
    return;
  }

  try {
    setLoading(true);

    let finalCategory = formData.category;

    // إضافة فئة جديدة
    if (!formData.category && newCategory.trim() !== "") {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      const added = await res.json();
      finalCategory = added.name;
      await fetchCategories();
    }

    // 🔥 رفع الصور عبر API route (الطريقة الآمنة)
    let imageURLs = [];

    if (imageFiles.length > 0) {
      const formDataToSend = new FormData();
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend, // لا حاجة ل headers مع FormData
      });

      if (!uploadRes.ok) throw new Error("فشل في رفع الصور");
      
      imageURLs = await uploadRes.json();
    } else {
      // إذا مفيش صور جديدة، استخدم الصور القديمة
      imageURLs = formData.images || [];
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      category: finalCategory || "أخرى",
      images: imageURLs,
    };

    const res = await fetch("/api/products", {
      method: formData.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!res.ok) throw new Error("فشل في الحفظ");

    setMessage(formData.id ? "✅ تم تعديل المنتج" : "✅ تم إضافة المنتج");
    
    // إعادة تعيين النموذج
    setFormData({
      id: null,
      name: "",
      price: "",
      description: "",
      images: [],
      video: "",
      youtube: "",
      article: "",
      category: "",
    });
    setImageFiles([]);
    setNewCategory("");
    await fetchProducts();
  } catch (err) {
    console.error(err);
    setMessage("❌ حدث خطأ أثناء الحفظ");
  } finally {
    setLoading(false);
  }
};
  const deleteProduct = async (id) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("فشل في الحذف");
      setMessage("🗑️ تم حذف المنتج");
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ أثناء الحذف");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 تعديل
  const editProduct = (p) => {
    setFormData({
      ...p,
      category: p.category?.name || p.category || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">🛍️ لوحة إدارة المتجر</h2>

      {message && <Alert variant="info">{message}</Alert>}

      {/* نموذج الإضافة */}
      <Form className="mb-4 p-3 border rounded bg-light shadow-sm">
        <Row className="g-3">
          <Col md={3}>
            <Form.Control
              placeholder="اسم المنتج"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Col>

          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="السعر"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Col>

          <Col md={3}>
            <Form.Control
              placeholder="الوصف القصير"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Col>

          <Col md={4}>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="المقال أو الوصف الطويل"
              name="article"
              value={formData.article}
              onChange={handleChange}
            />
          </Col>

          {/* 🚀 اختيار الفئة */}
          <Col md={4}>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "new") {
                  setFormData({ ...formData, category: "" });
                } else {
                  setFormData({ ...formData, category: value });
                }
              }}
            >
              <option value="">اختر الفئة</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}

              <option value="new">+ إضافة فئة جديدة</option>
            </Form.Select>

            {formData.category === "" && (
              <Form.Control
                type="text"
                placeholder="اكتب فئة جديدة"
                className="mt-2"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            )}
          </Col>

          <Col md={4}>
            <Form.Control
              type="url"
              placeholder="رابط يوتيوب"
              name="youtube"
              value={formData.youtube}
              onChange={handleChange}
            />
          </Col>

          <Col md={4}>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <Form.Text className="text-muted">يمكنك رفع أكثر من صورة.</Form.Text>
          </Col>

          <Col md={2}>
            <Button
              variant="success"
              className="w-100 h-100"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "جارٍ الحفظ..." : formData.id ? "💾 حفظ" : "➕ إضافة"}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* فلترة الفئات */}
      <div className="mb-3 text-end">
        <Form.Select
          style={{ width: "200px", display: "inline-block" }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="الكل">الكل</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </Form.Select>
      </div>

      {/* جدول المنتجات */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-success text-center">
            <tr>
              <th>الصور</th>
              <th>الاسم</th>
              <th>السعر</th>
              <th>الفئة</th>
              <th>الوصف</th>
              <th>إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="align-middle text-center">
                <td>
                  <img
                    src={p.images?.[0] || "https://via.placeholder.com/80"}
                    alt={p.name}
                    style={{ width: "80px", borderRadius: "10px" }}
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.price} جنيه</td>
                <td>{p.category || "—"}</td>
                <td>{p.description}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => editProduct(p)}
                  >
                    ✏️ تعديل
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteProduct(p.id)}
                  >
                    🗑️ حذف
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
