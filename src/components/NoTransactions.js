import Transactions from "../assets/transactions.svg"
import * as React from "react";


const NoTransactions = () => {
  return <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width:"100%",
    marginBottom: "2rem",
    flexDirection:"column"
  }}>
    <img src={Transactions} style={{width:"400px",margin:"4rem"}}/>
    <p
    style={{
        textAlign:"center",fontSize:"1.2rem"
    }}
    >You Have No Transactions Currently</p>
  </div>;
};

export default NoTransactions;
