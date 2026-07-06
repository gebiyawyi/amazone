import React from 'react';
import LayOut from '../../Layout/LayOut';
import CarouselEffect from '../../Carousel/CarouselEffect';
import Catagory from '../../Catagory/Catagory';
import Product from '../../products/Product';
function Landing() {
  console.log("the erererer")
  return (
    <LayOut>
      <CarouselEffect />
      <Catagory />
      <Product />
    </LayOut>
  ); 
}
export default Landing
