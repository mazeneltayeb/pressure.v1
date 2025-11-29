"use client";
import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

export default function NavigationBar() {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* اللوجو */}
        <Navbar.Brand as={Link} href="/">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">الرئيسية</Nav.Link>
            <Nav.Link as={Link} href="/about">من نحن</Nav.Link>
            <Nav.Link as={Link} href="/contact">اتصل بنا</Nav.Link>
            <Nav.Link as={Link} href="/articles">المقالات</Nav.Link>

            {/* قائمة الأسعار */}
            <NavDropdown title="الأسعار" id="prices-dropdown">
              <NavDropdown.Item as={Link} href="/prices/gold">أسعار الذهب</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/prices/currency">أسعار الصرف</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/prices/poultry">بورصة الدواجن</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/prices/materials">أسعار الخامات</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/prices/feeds">اسعار الاعلاف</NavDropdown.Item>

            </NavDropdown>

            <Nav.Link as={Link} href="/store">المتجر</Nav.Link>
          </Nav>

          {/* اللغة */}
          <div>
            <Image
              src="/egypt-flag.png"
              alt="AR"
              width={32}
              height={20}
              style={{ cursor: "pointer", marginRight: "10px" }}
            />
            <Image
              src="/usa-flag.png"
              alt="EN"
              width={32}
              height={20}
              style={{ cursor: "pointer" }}
            />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
