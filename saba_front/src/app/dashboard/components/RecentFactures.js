import React from "react";

function RecentFactures({ factures }) {

    return (

        <div className="card">

            <div className="card-body">

                <h4 className="card-title">

                    Dernières Factures

                </h4>

                <div className="table-responsive">

                    <table className="table table-hover">

                        <thead>

                            <tr>

                                <th>Référence</th>

                                <th>Montant</th>

                                <th>Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                factures.map((facture) => (

                                    <tr key={facture.id}>

                                        <td>{facture.reference_facture}</td>

                                        <td>

                                            {Number(facture.montant).toLocaleString()} FCFA

                                        </td>

                                        <td>{facture.date_facture}</td>

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

export default RecentFactures;