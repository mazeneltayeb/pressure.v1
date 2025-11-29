"use client";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AdSlot from "@/components/AdSlot";
export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container className="py-5">
      <AdSlot width="90%" height="150px" label="إعلان منتصف الصفحة" />
      <h1 className="text-center mb-4">📚 المقالات</h1>
      <Row>
  {articles.map((article) => (
    <Col md={4} key={article.id} className="mb-4">
      <Card className="shadow-sm h-100">
        {/* ✅ صورة الغلاف */}
        {article.coverImage && (
          <Card.Img
            variant="top"
            src={article.coverImage}
            style={{ height: "200px", objectFit: "cover" }}
            alt={article.title}
          />
        )}
        <Card.Body>
          <Card.Title>{article.title}</Card.Title>
          <Card.Text>
            {/* نعرض أول 120 حرف بس */}
            {article.sections?.[0]?.text?.slice(0, 120) || "لا يوجد محتوى"}
          </Card.Text>
          <Button variant="success" href={`/articles/${article.id}`}>
            اقرأ المزيد
          </Button>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>

        <AdSlot width="80%" height="120px" label="إعلان أسفل الصفحة" />
    </Container>
  );
}
