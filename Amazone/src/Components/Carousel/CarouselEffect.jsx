import React from 'react';
import { Carousel } from "react-responsive-carousel";
import Class from "./Carousel.module.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { img } from "./img/data";
function CarouselEffect() {
  return (
    <div>
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        interval={3000}
        transitionTime={800}
        showThumbs={false}
        showStatus={false}
        stopOnHover={false}
      >
        {img.map((imageItemLink, index) => {
          return <img key={index} src={imageItemLink} alt="" />;
        })}
      </Carousel>
      <div className={Class.hero_image}></div>
    </div>
  );
}
export default CarouselEffect;