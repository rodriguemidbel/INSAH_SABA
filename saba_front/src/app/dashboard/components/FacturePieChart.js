import React from "react";
import { Bar } from "react-chartjs-2";

function FacturePieChart({
payees = 0,
impayees = 0
}) {


const chartData = {
    labels: [
        "Réglées",
        "Non réglées"
    ],

    datasets: [
        {
            label: "Nombre de factures",

            data: [
                Number(payees) || 0,
                Number(impayees) || 0
            ],

            backgroundColor: [
                "#57B657",
                "#FF4747"
            ],

            borderColor: [
                "#57B657",
                "#FF4747"
            ],

            borderWidth: 1,

            borderRadius: 5,

            maxBarThickness: 100
        }
    ]
};

const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
        legend: {
            display: false
        },

        tooltip: {
            callbacks: {
                label: (context) =>
                    `${context.label} : ${context.parsed.y} facture(s)`
            }
        }
    },

    scales: {
        x: {
            title: {
                display: true,
                text: "État des factures"
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
                text: "Nombre de factures"
            }
        }
    }
};

return (
    <div className="card">
        <div className="card-body">
            <h4 className="card-title">
                État des factures
            </h4>

            <p className="text-muted">
                Comparaison des factures réglées et non réglées.
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

export default FacturePieChart;
