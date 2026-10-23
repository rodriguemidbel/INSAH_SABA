import React from "react";

function DashboardHeader() {

    const aujourdhui = new Date();

    return (

        <div className="row">

            <div className="col-12 grid-margin stretch-card">

                <div className="card corona-gradient-card">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <h2>

                                    Système de Gestion des Billets d'Avion

                                </h2>

                                <h5>

                                    Tableau de bord

                                </h5>

                                <p>

                                    Gestion des mémos, fournisseurs,
                                    bons de commande,
                                    billets,
                                    factures
                                    et règlements.

                                </p>

                            </div>

                            <div>

                                <h5>

                                    {aujourdhui.toLocaleDateString()}

                                </h5>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default DashboardHeader;