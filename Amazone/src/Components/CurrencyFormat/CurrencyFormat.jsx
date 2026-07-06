import React from "react";
import numeral from "numeral";
import styles from "./CurrencyFormat.module.css"; // Create this CSS file

const CurrencyFormat = ({ amount }) => {
  const formattedAmount = amount ? numeral(amount).format("$0,0.00") : "$0.00";

  // Split the formatted amount to style separately (optional)
  const parts = formattedAmount.split(".");
  const dollars = parts[0];
  const cents = parts[1] || "00";

  return (
    <div className={styles.currencyContainer}>
      <span className={styles.currencySymbol}>$</span>
      <span className={styles.dollarAmount}>{dollars.replace("$", "")}</span>
      <span className={styles.decimalPoint}>.</span>
      <span className={styles.centsAmount}>{cents}</span>
    </div>
  );
};

export default CurrencyFormat;
