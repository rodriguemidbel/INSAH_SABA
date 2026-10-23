import React from "react";
import { Bar } from "react-chartjs-2";

function BilletsChart({ data = [] }) {


if (!Array.isArray(data) || data.length === 0) {
    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">
                    Billets acquis par année
                </h4>

                <div className="text-center text-muted py-5">
                    Aucune donnée disponible.
                </div>
            </div>
        </div>
    );
}

const chartData = {
    labels: data.map((item) => String(item.annee)),

    datasets: [
        {
            label: "Nombre de billets acquis",

            data: data.map((item) => Number(item.total) || 0),

            backgroundColor: "#4B49AC",

            borderColor: "#4B49AC",

            borderWidth: 1,

            borderRadius: 5,

            maxBarThickness: 55
        }
    ]
};

const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
        legend: {
            display: true,
            position: "top"
        },

        tooltip: {
            callbacks: {
                label: (context) =>
                    `Billets acquis : ${context.parsed.y}`
            }
        }
    },

    scales: {
        x: {
            title: {
                display: true,
                text: "Année"
            }
        },

        y: {
            beginAtZero: true,

            ticks: {
                precision: 0,
                stepSize: 1
            },

            title: {
                display: true,
                text: "Nombre de billets"
            }
        }
    }
};

return (
    <div className="card">
        <div className="card-body">
            <h4 className="card-title">
                Billets acquis par année
            </h4>

            <p className="text-muted">
                Évolution annuelle du nombre de billets.
            </p>

            <div style={{ height: "320px" }}>
                <Bar
                    data={chartData}
                    options={options}
                />
            </div>
        </div>
    </div>
);


}

export default BilletsChart;
