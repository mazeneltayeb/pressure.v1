"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Card, Spinner } from "react-bootstrap";

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📥 جلب المقال من ملف JSON عبر API
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch("/api/articles");
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        const found = data.find((a) => String(a.id) === String(id));
        setArticle(found || null);
      } catch (error) {
        console.error("Error loading article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">جارٍ تحميل المقال...</p>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container className="py-5 text-center">
        <h2>المقال غير موجود ❌</h2>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* 🟢 إعلان أعلى الصفحة */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <p>📢 إعلان Google (728x90)</p>
      </div>

      {/* 📰 محتوى المقال */}
      <Card className="shadow-sm p-3">
        <Card.Title className="text-center mb-4">
          <h2>{article.title}</h2>
        </Card.Title>

        {article.sections && article.sections.length > 0 ? (
          article.sections.map((section, index) => (
            <div key={index} className="mb-4">
              {section.text && (
                <p
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    textAlign: "justify",
                    color: "#333",
                  }}
                >
                  {section.text}
                </p>
              )}
              {section.image && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
                  }}
                >
                  <img
                    src={section.image}
                    alt={`صورة ${index + 1}`}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "10px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              textAlign: "justify",
              color: "#333",
            }}
          >
            لا توجد أقسام لهذا المقال.
          </p>
        )}
      </Card>

      {/* 🟢 إعلان أسفل الصفحة */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
          borderRadius: "10px",
          marginTop: "40px",
        }}
      >
        <p>📢 مساحة إعلان (728x90)</p>
      </div>
    </Container>
  );
}
