// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
// import AdSlot from "@/components/AdSlot";

// export default function StorePage() {
//   const [products, setProducts] = useState(null);

//   useEffect(() => {
//     async function fetchProducts() {
//       const res = await fetch("/api/products");
//       const data = await res.json();

//       setProducts(data);
//     }
//     fetchProducts();
//   }, []);

//   if (!products)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" variant="success" />
//       </div>
//     );

//   return (
//     <Container className="py-5">
//         <AdSlot width="80%" height="120px" label="إعلان أسفل الصفحة" />

//       <h1 className="text-center mb-4">🛒 متجر الأعلاف والخامات</h1>

//       <Row>
//         {products.map((product) => (
//           <Col md={4} lg={3} key={product.id} className="mb-4">
//             <Card className="h-100 shadow-sm">
//               <Card.Img
//                 variant="top"
//                 src={
//                   (product.images && product.images[0]) ||
//                   product.image ||
//                   "https://via.placeholder.com/300x200?text=No+Image"
//                 }
//                 style={{
//                   height: "200px",
//                   objectFit: "cover",
//                   borderTopLeftRadius: "10px",
//                   borderTopRightRadius: "10px",
//                 }}
//               />
//               <Card.Body className="d-flex flex-column">
//                 <Card.Title className="text-center">{product.name}</Card.Title>
//                 <Card.Text className="text-center text-muted flex-grow-1">
//                   {product.description?.length > 60
//                     ? product.description.slice(0, 60) + "..."
//                     : product.description}
//                 </Card.Text>
//                 <h5 className="text-success text-center mb-3">
//                   {Number(product.price).toLocaleString()} جنيه
//                 </h5>
//                 <div className="d-flex justify-content-evenly">
//                   <Link href={`/store/${product.id}`}>
//                     <Button variant="outline-success">عرض التفاصيل</Button>
//                   </Link>
//                   <Link href={`/store/${product.id}`}>
//                     <Button variant="success">اطلب الآن</Button>
//                   </Link>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {/* 📢 مساحة إعلان */}
//       <div
//         style={{
//           backgroundColor: "#f8f9fa",
//           padding: "20px",
//           textAlign: "center",
//           borderRadius: "10px",
//           marginTop: "40px",
//         }}
//       >
//         <p>📢 مساحة إعلان (728x90)</p>
//       </div>
//     </Container>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import AdSlot from "@/components/AdSlot";
import { supabase } from "/lib/supabaseClient";

export default function StorePage() {
  const [products, setProducts] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // التحقق من حالة المستخدم
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoadingAuth(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  if (!products || loadingAuth)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">جاري التحميل...</p>
      </div>
    );

  return (
    <Container className="py-5">
      <AdSlot width="80%" height="120px" label="إعلان أسفل الصفحة" />

      <h1 className="text-center mb-4">🛒 متجر الأعلاف والخامات</h1>

      {/* رسالة للمستخدمين غير المسجلين */}
      {!user && (
        <Alert variant="warning" className="text-center mb-4">
          <strong>ملاحظة:</strong> سجل الدخول لرؤية أسعار المنتجات وتفاصيل الطلب
        </Alert>
      )}

      <Row>
        {products.map((product) => (
          <Col md={4} lg={3} key={product.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={
                  (product.images && product.images[0]) ||
                  product.image ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                style={{
                  height: "200px",
                  objectFit: "cover",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center">{product.name}</Card.Title>
                <Card.Text className="text-center text-muted flex-grow-1">
                  {product.description?.length > 60
                    ? product.description.slice(0, 60) + "..."
                    : product.description}
                </Card.Text>
                
                {/* عرض السعر فقط للمستخدمين المسجلين */}
                {user ? (
                  <h5 className="text-success text-center mb-3">
                    {Number(product.price).toLocaleString()} جنيه
                  </h5>
                ) : (
                  <h5 className="text-warning text-center mb-3">
                    سجل الدخول لرؤية السعر
                  </h5>
                )}
                
                <div className="d-flex justify-content-evenly">
                  <Link href={`/store/${product.id}`}>
                    <Button variant="outline-success">عرض التفاصيل</Button>
                  </Link>
                  
                  {/* زر الطلب - يختلف حسب حالة المستخدم */}
                  {user ? (
                    <Link href={`/store/${product.id}`}>
                      <Button variant="success">اطلب الآن</Button>
                    </Link>
                  ) : (
                    <Button 
                      variant="outline-warning"
                      onClick={() => {
                        // يمكنك إضافة وظيفة تسجيل الدخول هنا
                        window.location.href = '/auth/signin';
                      }}
                    >
                      سجل الدخول للطلب
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 📢 مساحة إعلان */}
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
