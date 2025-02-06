import React, { useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = () => {

    const [chartType, setChartType] = useState("days");
    const chartDataDays = {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // Days of the week
        datasets: [
            {
                label: "Weekly Data",
                data: [40, 35, 50, 60, 45, 70, 55], // Data for each day of the week
                borderColor: "#FACC15",
                backgroundColor: "rgba(250, 204, 21, 0.2)",
                pointBackgroundColor: "#FACC15",
            },
        ],
    };


    const chartDataYear = {
        labels: ["2021", "2022", "2023", "2024", "2025"], // Years
        datasets: [
            {
                label: "Yearly Data",
                data: [500, 600, 700, 800, 900], // Data for each year
                borderColor: "#FACC15",
                backgroundColor: "rgba(250, 204, 21, 0.2)",
                pointBackgroundColor: "#FACC15",
            },
        ],
    };


    const chartDataMonth = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
            {
                label: "Monthly Data",
                data: [40, 35, 50, 60, 45, 70, 55, 65, 50, 60, 70, 75],
                borderColor: "#FACC15",
                backgroundColor: "rgba(250, 204, 21, 0.2)",
                pointBackgroundColor: "#FACC15",
            },
        ],
    };


    return (
        <div className="flex flex-col bg-[#191919]  text-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
                <p className="text-xl font-medium mb-2">Overview:</p>
            </div>
            <div className="flex">
                <div className="w-10/12">
                    {
                        (() => {
                            try {
                                return <Line data={chartType === 'days' ? chartDataDays : chartType === 'months' ? chartDataMonth : chartDataYear} />;
                            } catch (error) {
                                console.error("Chart rendering error:", error);
                                return null;
                            }
                        })()
                    }
                </div>

                <div className="flex flex-col  gap-2 justify-center w-2/12">
                    <button className={` hover:text-white text-sm ${chartType==='months'? 'text-white':'text-gray-400'}`} onClick={() => setChartType('months')}>months</button>
                    <button className={` hover:text-white text-sm ${chartType==='days'? 'text-white':'text-gray-400'}`} onClick={() => setChartType('days')}>days</button>
                    <button className={` hover:text-white text-sm ${chartType==='years'? 'text-white':'text-gray-400'}`} onClick={() => setChartType('years')}>year</button>
                </div>
            </div>
        </div>
    )
}
export default LineChart;