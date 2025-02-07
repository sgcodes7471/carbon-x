import React, { useContext, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Context } from "../context/context";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = () => {
  const [chartData, setChartData] = useState({});
  const context = useContext(Context);
  const { iotData } = context; // Assuming iotData is an array

  useEffect(() => {
    if (!iotData || iotData.length === 0) {
      console.log("No data available for chart");
      return;
    }
    // console.log(iotData)
    // Generate labels (1 to n)
    const length = iotData?.length || 0; // Assuming each sub-array is of equal length
    const labelsArray = Array.from({ length }, (_, i) => i + 1);

    // Calculate dataset values (sum of all iotData arrays for each index)
    // const dataSets = iotData
    // console.log(labelsArray)
    // Update chartData state
    setChartData({
      labels: labelsArray,
      datasets: [
        {
          label: "Daily Consumption",
          data: iotData,
          borderColor: "#FACC15",
          backgroundColor: "rgba(250, 204, 21, 0.2)",
          pointBackgroundColor: "#FACC15",
        },
      ],
    });
  }, [iotData]); // Recalculate whenever iotData changes

  return (
    <div className="flex flex-col bg-[#191919] h-[55vh] text-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center h-2/12">
        <p className="text-xl font-medium mb-2">Smart Meters Measurements:</p>
      </div>
      <div className="flex h-full">
        <div className="w-10/12 h-full">
          {chartData?.datasets?.[0]?.data?.length > 0 ? (
            <Line data={chartData} options={{ maintainAspectRatio: false }} width={2000} />
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineChart;
