"use client";
import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";

export default function ArticlesDashboard() {
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);


const initialArticle = {
  title: "",
  coverImage: "",
  sections: [{ text: "", image: "" }],
};

const [newArticle, setNewArticle] = useState(initialArticle);

  // 📥 جلب المقالات من الـ API
  useEffect(() => {
    fetchArticles();
  }, []);


  const fetchArticles = async () => {
  try {
    const res = await fetch("/api/articles");
    if (!res.ok) throw new Error("Fetch failed");
    const text = await res.text();
    const data = text ? JSON.parse(text) : [];
    setArticles(data);
  } catch (error) {
    console.error("Error fetching articles:", error);
    setArticles([]);
  }
};


  // ➕ إضافة مقال جديد
  const handleAddArticle = async () => {
    if (!newArticle.title || newArticle.sections.every(s => !s.text && !s.image))
      return alert("اكمل البيانات يا طيب ❤️");

//     await fetch("/api/articles", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       // body: JSON.stringify(newArticle),
//       body: JSON.stringify({
//   title: newArticle.title.trim(),
//   sections: newArticle.sections.map((s) => ({
//     text: s.text?.trim() || "",
//     image: s.image?.trim() || "",
//   })),
// }),

//     });
await fetch("/api/articles", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: newArticle.title.trim(),
    coverImage: newArticle.coverImage.trim(),
    sections: newArticle.sections.map((s) => ({
      text: s.text?.trim() || "",
      image: s.image?.trim() || "",
    })),
  }),
});


    await fetchArticles();
    closeModal();
  };

  // ✏️ تعديل مقال
  const handleEditArticle = (article) => {
    setIsEditing(true);
    setCurrentId(article.id);
    setNewArticle(article);
    setShowModal(true);
  };

  const handleUpdateArticle = async () => {
    await fetch("/api/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newArticle, id: currentId }),
    });

    await fetchArticles();
    closeModal();
  };

  // 🗑️ حذف مقال
  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      await fetch("/api/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchArticles();
    }
  };

  // 🧩 التعامل مع الأقسام داخل المقال
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...newArticle.sections];
    updatedSections[index][field] = value;
    setNewArticle({ ...newArticle, sections: updatedSections });
  };

  const addSection = () => {
    setNewArticle({
      ...newArticle,
      sections: [...newArticle.sections, { text: "", image: "" }],
    });
  };

  const removeSection = (index) => {
    const updatedSections = newArticle.sections.filter((_, i) => i !== index);
    setNewArticle({ ...newArticle, sections: updatedSections });
  };

  // ❌ غلق المودال
  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    // setNewArticle({ title: "", sections: [{ text: "", image: "" }] });
    setNewArticle(initialArticle);

  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📋 إدارة المقالات</h2>

      <div className="d-flex justify-content-end mb-3">
        <Button onClick={() => setShowModal(true)}>➕ إضافة مقال جديد</Button>
      </div>

      <Table bordered hover responsive className="shadow-sm">
        <thead className="table-light">
          <tr>
            <th>العنوان</th>
            <th>عدد الأقسام</th>
            <th>تحكم</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.sections.length}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditArticle(a)}
                >
                  تعديل
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(a.id)}
                >
                  حذف
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 🪟 نافذة الإضافة / التعديل */}
      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "تعديل المقال" : "إضافة مقال جديد"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>العنوان</Form.Label>
              <Form.Control
                type="text"
                value={newArticle.title}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>رابط صورة الغلاف</Form.Label>
  <Form.Control
    type="text"
    placeholder="ضع هنا رابط الصورة الأساسية للمقال"
    value={newArticle.coverImage}
    onChange={(e) =>
      setNewArticle({ ...newArticle, coverImage: e.target.value })
    }
  />
            </Form.Group>

            {newArticle.sections.map((section, index) => (
              <div
                key={index}
                className="border rounded p-3 mb-3 bg-light position-relative"
              >
                <h6>الجزء {index + 1}</h6>
                <Form.Group className="mb-2">
                  <Form.Label>النص</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={section.text}
                    onChange={(e) =>
                      handleSectionChange(index, "text", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>رابط الصورة (اختياري)</Form.Label>
                  <Form.Control
                    type="text"
                    value={section.image}
                    onChange={(e) =>
                      handleSectionChange(index, "image", e.target.value)
                    }
                  />
                </Form.Group>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeSection(index)}
                >
                  حذف هذا الجزء
                </Button>
              </div>
            ))}

            <Button variant="secondary" onClick={addSection}>
              ➕ إضافة جزء جديد
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={isEditing ? handleUpdateArticle : handleAddArticle}
          >
            {isEditing ? "حفظ التعديلات" : "حفظ المقال"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
