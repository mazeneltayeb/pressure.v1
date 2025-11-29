

// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation"; // استخدم useParams بدل use
// import { Container, Row, Col, Carousel, Spinner, Alert } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function ProductPage() {
//   const params = useParams();
//   const id = params.id;
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchProduct() {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/products/${id}`);
        
//         if (!res.ok) {
//           throw new Error("فشل في جلب المنتج");
//         }
        
//         const data = await res.json();
        
//         if (data.error) {
//           setError(data.error);
//         } else {
//           setProduct(data);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError("حدث خطأ أثناء تحميل المنتج");
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   const getEmbedUrl = (url) => {
//     if (!url) return null;
//     if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
//     if (url.includes("youtu.be/")) {
//       const v = url.split("youtu.be/")[1].split("?")[0];
//       return `https://www.youtube.com/embed/${v}`;
//     }
//     return url;
//   };

//   if (loading) {
//     return (
//       <Container className="text-center py-5">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-2">جاري تحميل المنتج...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="py-5">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   if (!product) {
//     return (
//       <Container className="py-5">
//         <Alert variant="warning">المنتج غير موجود</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-5">
//       <Row>
//         <Col md={6}>
//           {/* معرض الصور */}
//           {product.images && product.images.length > 0 ? (
//             <Carousel>
//               {product.images.map((img, index) => (
//                 <Carousel.Item key={index}>
//                   <img
//                     className="d-block w-100"
//                     src={img}
//                     alt={`${product.name} - صورة ${index + 1}`}
//                     style={{ height: "400px", objectFit: "cover" }}
//                   />
//                 </Carousel.Item>
//               ))}
//             </Carousel>
//           ) : (
//             <div className="text-center py-5 border rounded">
//               <p>لا توجد صور للمنتج</p>
//             </div>
//           )}
//         </Col>

//         <Col md={6}>
//           <h1>{product.name}</h1>
//           <h3 className="text-primary">{product.price} جنيه</h3>
//           <p className="text-muted">{product.category}</p>
          
//           <div className="my-4">
//             <h5>الوصف:</h5>
//             <p>{product.description || "لا يوجد وصف"}</p>
//           </div>

//           {product.article && (
//             <div className="my-4">
//               <h5>التفاصيل:</h5>
//               <p>{product.article}</p>
//             </div>
//           )}

//           {getEmbedUrl(product.youtube) && (
//             <div className="my-4">
//               <h5>فيديو:</h5>
//               <iframe
//                 width="100%"
//                 height="315"
//                 src={getEmbedUrl(product.youtube)}
//                 title="فيديو المنتج"
//                 frameBorder="0"
//                 allowFullScreen
//               ></iframe>
//             </div>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Row, Col, Carousel, Spinner, Alert, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "/lib/supabaseClient";

export default function ProductPage() {
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        
        if (!res.ok) {
          throw new Error("فشل في جلب المنتج");
        }
        
        const data = await res.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("حدث خطأ أثناء تحميل المنتج");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) {
      const v = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${v}`;
    }
    return url;
  };

  if (loading || loadingAuth) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">جاري تحميل المنتج...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">المنتج غير موجود</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* رسالة للمستخدمين غير المسجلين */}
      {!user && (
        <Alert variant="warning" className="text-center mb-4">
          <strong>ملاحظة:</strong> سجل الدخول لرؤية سعر المنتج وإمكانية الطلب
        </Alert>
      )}

      <Row>
        <Col md={6}>
          {/* معرض الصور */}
          {product.images && product.images.length > 0 ? (
            <Carousel>
              {product.images.map((img, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={img}
                    alt={`${product.name} - صورة ${index + 1}`}
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-5 border rounded">
              <p>لا توجد صور للمنتج</p>
            </div>
          )}
        </Col>

        <Col md={6}>
          <h1>{product.name}</h1>
          
          {/* عرض السعر فقط للمستخدمين المسجلين */}
          {user ? (
            <h3 className="text-primary">{Number(product.price).toLocaleString()} جنيه</h3>
          ) : (
            <h3 className="text-warning">سجل الدخول لرؤية السعر</h3>
          )}
          
          <p className="text-muted">{product.category}</p>
          
          <div className="my-4">
            <h5>الوصف:</h5>
            <p>{product.description || "لا يوجد وصف"}</p>
          </div>

          {product.article && (
            <div className="my-4">
              <h5>التفاصيل:</h5>
              <p>{product.article}</p>
            </div>
          )}

          {getEmbedUrl(product.youtube) && (
            <div className="my-4">
              <h5>فيديو:</h5>
              <iframe
                width="100%"
                height="315"
                src={getEmbedUrl(product.youtube)}
                title="فيديو المنتج"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* أزرار الإجراء - تختلف حسب حالة المستخدم */}
          <div className="mt-4 d-flex gap-3">
            {user ? (
              <>
                <Button variant="success" size="lg">
                  أضف إلى السلة
                </Button>
                <Button variant="primary" size="lg">
                  اطلب الآن
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline-warning" 
                  size="lg"
                  onClick={() => {
                    // توجيه إلى صفحة تسجيل الدخول
                    window.location.href = '/auth/signin';
                  }}
                >
                  سجل الدخول للشراء
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={() => {
                    // توجيه إلى صفحة التسجيل
                    window.location.href = '/auth/signup';
                  }}
                >
                  إنشاء حساب جديد
                </Button>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}