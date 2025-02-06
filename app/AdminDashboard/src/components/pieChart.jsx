import { Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    ArcElement,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ArcElement);

const PieChart = () => {
    const creditdata = {
        datasets: [
            {
                data: [47, 53],
                backgroundColor: ["#D9D9D9", "#3F3F3F",],
                borderWidth: 0,
            },
        ],
    };

    const creditoptions = {
        cutout: "80%",
        plugins: {
            tooltip: { enabled: false },
        },
    };
    return (
        <div className="flex flex-col items-center bg-[#191919] text-white p-4 rounded-lg shadow-lg w-8/12 py-8">
            <p className="text-xl mb-2 font-medium">Account credits:</p>
            {
                (() => {
                try {
                    return <Doughnut data={creditdata} options={creditoptions} />
                } catch { error } {
                    console.log(error)
                }
                 })()
            
            }

            <p className="text-sm mt-4"> <span className="mr-2 font-medium text-xl">$</span> <span className="font-bold text-xl">47/</span> credits</p>
        </div>

    )
}

export default PieChart;