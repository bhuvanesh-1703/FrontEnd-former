import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Container } from "react-bootstrap";
import "../css/Banners.css";

function Banners() {
  const [index, setIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1920&q=80",
      badge: "Organic & Fresh",
      title: (
        <>
          Fresh From Farm
          <br />
          To Your Table
        </>
      ),
      description:
        "Experience the true taste of nature with our handpicked organic produce delivered straight from the farm.",
    
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920&q=80",
      badge: "100% Pesticide Free",
      title: (
        <>
          Healthy Living
          <br />
          Starts Here
        </>
      ),
      description:
        "Fuel your body with the purest vegetables and fruits. We guarantee chemical-free organic integrity.",
    
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1495570689269-d883b1224443?auto=format&fit=crop&w=1920&q=80",
      badge: "Eco-Friendly Farming",
      title: (
        <>
          Sustainable
          <br />
          For The Planet
        </>
      ),
      description:
        "Support local farmers and sustainable practices. Better for you, better for the earth.",
    
    },
  ];

  return (
    <Carousel
      activeIndex={index}
      onSelect={(selectedIndex) => setIndex(selectedIndex)}
      interval={5000}
      pause="hover"
      className="hero-carousel"
      fade
      aria-roledescription="carousel"
      aria-label="Farm Aura featured promotions"
    >
      {slides.map((slide) => (
        <Carousel.Item key={slide.id}>
          <div className="hero-image-wrapper">
            <img
              className="d-block w-100 hero-image"
              src={slide.image}
              alt={
                typeof slide.title === "string"
                  ? slide.title
                  : `Slide ${slide.id}`
              }
              loading="lazy"
            />
            <div className="hero-overlay" />
          </div>
          <Carousel.Caption className="hero-caption">
            <Container>
              <span className="hero-badge">{slide.badge}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.description}</p>
              <div className="hero-btn-group">
              
              
              </div>
            </Container>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Banners;
