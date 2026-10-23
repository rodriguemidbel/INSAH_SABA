import React from "react";

function RecentBillets({ billets }) {

    return (

        <div className="card">

            <div className="card-body">

                <h4 className="card-title">

                    Derniers Billets

                </h4>

                <div className="table-responsive">

                    <table className="table table-striped">

                        <thead>

                            <tr>

                                <th>Nom</th>

                                <th>Prénom</th>

                                <th>Destination</th>

                                <th>Montant</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                billets.map((billet) => (

                                    <tr key={billet.id}>

                                        <td>{billet.nom}</td>

                                        <td>{billet.prenom}</td>

                                        <td>{billet.destination}</td>

                                        <td>

                                            {Number(billet.montant).toLocaleString()} FCFA

                                        </td>

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

export default RecentBillets;