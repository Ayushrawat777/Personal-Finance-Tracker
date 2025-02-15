import React from "react";
/* import { Line, Pie } from "@ant-design/plots"; */
import { Line, Pie } from "@ant-design/charts";
const ChartComponent = ({ sortedTransactions }) => {
   const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  }); 

  const spendingData = sortedTransactions.filter((transaction) => {
    if (transaction.type === "expense") {
      return { tag: transaction.tag, amount: transaction.amount };
    }
  });

  let finalSpendings = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  let newSpendings = [
    { tag: "food", amount: 0 },
    {
      tag: "education",
      amount: 0,
    },
    {
      tag: "office",
      amount: 0,
    },
  ];
  spendingData.forEach((item) => {
    if (item.tag === "food") {
      newSpendings[0].amount += item.amount;
    } else if (item.tag === "education") {
      newSpendings[1].amount += item.amount;
    } else {
      newSpendings[2].amount += item.amount;
    }
  }); 

 const config = {
    data: data,
    autoFit: true,
    width: 500,
    xField: "date",
    yField: "amount",
  }; 

 
  // ✅ Pie Chart Configuration
  const spendingConfig = {
    data: spendingData,
    angleField: "amount",
    colorField: "tag",
    width: 500,
  };
  let chart;
  let pieChart;
  return (
    <div className="charts">
      <div className="charts-wrapper">
        <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      </div>
      <div className="charts-wrapper">
        <h2 style={{ marginTop: 0 }}>Your Spendings</h2>
        <Pie
          {...spendingConfig}
          onReady={(chartInstance) => (pieChart = chartInstance)}
        />
      </div>
    </div>
  );
};

export default ChartComponent;