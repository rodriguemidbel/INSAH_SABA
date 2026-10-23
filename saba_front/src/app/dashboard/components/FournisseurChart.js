import React from "react";

import { Bar } from "react-chartjs-2";

function FournisseurChart({

    data

}) {

    const chartData = {

        labels:

            data.map(

                f =>

                f.fournisseur__agence

            ),

        datasets: [

            {

                label:

                    "Billets",

                data:

                    data.map(

                        f =>

                        f.total

                    ),

                backgroundColor:

                    "#ffab00"

            }

        ]

    };

    return (

        <div className="card">

            <div className="card-body">

                <h4>

                    Billets par Fournisseur

                </h4>

                <Bar

                    data={chartData}

                />

            </div>

        </div>

    );

}

export default FournisseurChart;