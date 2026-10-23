import React from "react";

function RecentReglements({ reglements }) {

    return (

        <div className="card">

            <div className="card-body">

                <h4 className="card-title">

                    Derniers Règlements

                </h4>

                <div className="table-responsive">

                    <table className="table table-bordered">

                        <thead>

                            <tr>

                                <th>Facture</th>

                                <th>Montant</th>

                                <th>Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                reglements.map((reglement) => (

                                    <tr key={reglement.id}>

                                        <td>{reglement.facture_reference}</td>

                                        <td>

                                            {Number(reglement.montant_regle).toLocaleString()} FCFA

                                        </td>

                                        <td>{reglement.date_reglement}</td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default RecentReglements;