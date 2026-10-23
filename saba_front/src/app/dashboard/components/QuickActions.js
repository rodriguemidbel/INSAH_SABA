import React from "react";

import { Link } from "react-router-dom";

function QuickActions() {

    return (

        <div className="card">

            <div className="card-body">

                <h4>

                    Actions rapides

                </h4>

                <div className="row">

                    <div className="col-md-2">

                        <Link
                            to="/memo-pages/liste-memo"
                            className="btn btn-primary btn-block"
                        >

                            Mémos

                        </Link>

                    </div>

                    <div className="col-md-2">

                        <Link
                            to="/billet-pages/import"
                            className="btn btn-success btn-block"
                        >

                            Import Billets

                        </Link>

                    </div>

                    <div className="col-md-2">

                        <Link
                            to="/paiement-pages/facture/liste-facture"
                            className="btn btn-warning btn-block"
                        >

                            Factures

                        </Link>

                    </div>

                    <div className="col-md-2">

                        <Link
                            to="/paiement-pages/reglement"
                            className="btn btn-info btn-block"
                        >

                            Règlements

                        </Link>

                    </div>

                    <div className="col-md-2">

                        <Link
                            to="/fournisseur-pages/liste"
                            className="btn btn-danger btn-block"
                        >

                            Fournisseurs

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default QuickActions;