import React from 'react';
import { catagoyimage } from "./CatagoryFull";
import classes from "./Catagory.module.css";
import CatagoryCard from './CatagoryCard';

function Catagory() {
  return (
    <section className={classes.container}>
      {catagoyimage.map((infos) => (
        <CatagoryCard data={infos} />
      ))}
    </section>
  );
}

export default Catagory
