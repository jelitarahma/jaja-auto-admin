// import React from "react";
// import ApexCharts from "react-apexcharts";

// const series = [{
//   name: 'Your Activity',
//   type: 'column',
//   data: [350, 275, 375, 375, 300, 225, 275]
// }, {
//   name: 'Your Goal',
//   type: 'line',
//   data: [400, 350, 450, 400, 350, 300, 350]

// }];

// const chartSettings = {
//   colors: ["#FFCA41", "#43BC13"],
//   chart: {
//     height: 350,
//     type: 'line',
//     toolbar: {
//       show: false,
//     },
//   },
//   stroke: {
//     curve: "straight",
//     width: [0, 1]
//   },
//   dataLabels: {
//     enabled: true,
//     enabledOnSeries: [1],
//     style: {
//       fontSize: '10px',
//       fontWeight: 500,
//     },
//     background: {
//       borderWidth: 0,
//     },
//   },
//   labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//   legend: {
//     position: "top",
//     floating: true,
//   },
//   xaxis: {
//     type: 'category',
//     axisBorder: {
//       show: false
//     },
//     axisTicks: {
//       show: false
//     },
//     labels: {
//       show: true,
//       style: {
//         colors: "#6B859E",
//       },
//     },
//   },
//   yaxis: {
//     show: false,
//   },
//   fill: {
//     type: "solid",
//     opacity: 1,
//   },
//   plotOptions: {
//     bar: {
//       borderRadius: 10,
//     }
//   },
//   grid: {
//     show: false,
//   }
// };

// export default function ApexActivityChart() {
//   return (
//     <ApexCharts
//       options={chartSettings}
//       series={series}
//       type="area"
//       height={275}
//     />
//   )
// }

import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const token = localStorage.getItem("token");

export default function ApexActivityChart() {
  const [chartData, setChartData] = useState(Array(12).fill(0));

  useEffect(() => {
    fetch("https://staging-api.jaja.id/dashboard/get-dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Inisialisasi data bulan dengan nilai 0
        const monthlyData = {
          January: 0,
          February: 0,
          March: 0,
          April: 0,
          May: 0,
          June: 0,
          July: 0,
          August: 0,
          September: 0,
          October: 0,
          November: 0,
          December: 0,
        };

        // Akumulasi nilai untuk setiap bulan
        data.chart.forEach((item) => {
          const [day, month, year] = item.label.split(" ");
          if (monthlyData[month] !== undefined) {
            monthlyData[month] += parseInt(item.values);
          }
        });

        // Isi nilai-nilai untuk bulan-bulan dalam tahun
        const chartDataArray = Object.values(monthlyData);
        console.log("Token chart", token);
        setChartData(chartDataArray);
      })
      .catch((error) =>
        console.error("Error fetching chart data:", error)
      );
  }, []);

  const series = [
    {
      name: "",
      type: "column",
      data: chartData,
    },
    {
      name: 'Grafik bulanan',
      type: 'line',
      data: chartData
    }
  ];

  const chartSettings = {
    // colors: ["#FFCA41", "#43BC13"],
    colors: ["#FFFFFF", "#43BC13"],
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [0, 2],
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
      style: {
        fontSize: "10px",
        fontWeight: 500,
      },
      background: {
        borderWidth: 0,
      },
    },
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    legend: {
      position: "top",
      floating: true,
    },
    xaxis: {
      type: "category",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        style: {
          colors: "#6B859E",
        },
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
      },
    },
    grid: {
      show: false,
    },
  };

  return (
    <>
      <ApexCharts
        options={chartSettings}
        series={series}
        type="area"
        height={275}
      />

      <style>
        {`
          .apexcharts-legend.apx-legend-position-bottom, .apexcharts-legend.apx-legend-position-top {
            flex-wrap: wrap;
            display : none;
        }

          .apexcharts-tooltip{
            display: none !important;
          }
        `}
      </style>
    </>
    
  );
}
