import React from "react";
import { Bar } from "react-chartjs-2";


function FacturesParMoisChart({ data = [] }) {

    // ==============================
    // Vérification des données
    // ==============================

    if (!data || data.length === 0) {
        return (
            <div className="card">
                <div className="card-body">

                    <h4 className="card-title">
                        Factures par mois
                    </h4>

                    <div className="text-center text-muted py-5">
                        Aucune donnée disponible.
                    </div>

                </div>
            </div>
        );
    }


    // ==============================
    // Données du graphique
    // ==============================

    const chartData = {

        labels: data.map((item) => item.mois),

        datasets: [
            {
                label: "Factures",

                data: data.map((item) => item.total),

                backgroundColor: [
                    "#4B49AC",
                    "#248AFD",
                    "#FFC100",
                    "#57B657",
                    "#FF4747",
                    "#6C757D",
                    "#17A2B8",
                    "#9C27B0",
                    "#FF9800",
                    "#795548",
                    "#009688",
                    "#607D8B"
                ],

                borderWidth: 1
            }
        ]
    };


    // ==============================
    // Options
    // ==============================

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        legend: {
            display: true
        },

        scales: {

            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        precision: 0
                    }
                }
            ]
        }
    };


    return (
        <div className="card">

            <div className="card-body">

                <h4 className="card-title">
                    Factures par mois
                </h4>

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


export default FacturesParMoisChart;