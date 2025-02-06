import React, { useContext, useState } from "react";
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

    const [chartType, setChartType] = useState("days");
    const context = useContext(Context);
    const {iotData} = context;
    let length = Object.values(iotData)[0]?.length || 0;
    let labelsArray = Array.from({ length }, (_, i) => i + 1);
    const dataSets = Array.from({ length }, (_, i) => 
        Object.values(iotData).reduce((sum, arr) => sum + arr[i], 0)
    );

    const chartData = {
        labels : labelsArray,
        datasets : [
            {
                label:"Daily Consumption",
                data:dataSets,
                borderColor: "#FACC15",
                backgroundColor: "rgba(250, 204, 21, 0.2)",
                pointBackgroundColor: "#FACC15",
            }
        ]
    }
    

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


    const dayWiseData = {
       
    }

    return (
        <div className="flex flex-col bg-[#191919] h-[55vh] text-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center h-2/12">
                <p className="text-xl font-medium mb-2">Smart Meters Measurements:</p>
            </div>
            <div className="flex h-full">
                <div className="w-10/12 h-full">
                    {
                        (() => {
                            try {
                                return <Line data={chartDataMonth}
                                options={{ maintainAspectRatio: false }} width={2000}/>;
                            } catch (error) {
                                console.error("Chart rendering error:", error);
                                return null;
                            }
                        })()
                    }
                </div>

                {/* <div className="flex flex-col  gap-2 justify-center w-2/12">
                    <button className={` hover:text-white text-sm ${chartType==='months'? 'text-white':'text-gray-400'}`} onClick={() => setChartType('months')}>months</button>
                    <button className={` hover:text-white text-sm ${chartType==='days'? 'text-white':'text-gray-400'}`} onClick={() => setChartType('days')}>days</button>
                    <button className={` hover:text-white text-sm ${chartType==='years'? 'text-white':'text-gray-400'}`} onClick={() => setChartType('years')}>year</button>
                </div> */}
            </div>
        </div>
    )
}
export default LineChart;