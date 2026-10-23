import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import AxiosInstance from "../../Axios";

function ListeReglement() {

    const [reglements, setReglements] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [reglementSelectionne, setReglementSelectionne] = useState(null);

    useEffect(() => {
        chargerReglements();
    }, []);

    const chargerReglements = () => {

        AxiosInstance.get("reglement/")
            .then((res) => {

                setReglements(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    };

    const ouvrirReglement = (reglement) => {

        setReglementSelectionne(reglement);

        setShowModal(true);

    };

    const supprimerReglement = (id) => {

        if (!window.confirm("Voulez-vous supprimer ce règlement ?")) {
            return;
        }

        AxiosInstance.delete(`reglement/${id}/`)
            .then(() => {

                chargerReglements();

            })
            .catch((err) => {

                console.log(err);

            });

    };


    return (

        <div>

            <div className="page-header">

                <h3 className="page-title">
                    Liste des règlements
                </h3>

                <nav aria-label="breadcrumb">

                    <ol className="breadcrumb">

                        <li className="breadcrumb-item">

                            <Link
                                to="/paiement-pages/reglement/liste-reglement"
                            >
                                Liste
                            </Link>

                        </li>

                    </ol>

                </nav>

            </div>

            <div className="row">

                <div className="col-lg-12 grid-margin stretch-card">

                    <div className="card">

                        <div className="card-body">

                            <h4 className="card-title">

                                Historique des règlements

                            </h4>

                            <div className="table-responsive">

                                <table className="table table-hover">

                                    <thead>

                                        <tr>

                                            <th>Facture</th>

                                            <th>Mémo</th>

                                            <th>Fournisseur</th>

                                            <th>Montant</th>

                                            <th>Date</th>

                                            <th>N° Chèque / OV</th>

                                            <th>acquitement</th>

                                            <th>Actions</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {

                                            reglements.length > 0 ?

                                            reglements.map((reglement) => (

                                                <tr
                                                    key={reglement.id}
                                                >

                                                    <td>

                                                        {

                                                            reglement.reference_facture

                                                        }

                                                    </td>

                                                    <td>

                                                        {

                                                            reglement.reference_memo

                                                        }

                                                    </td>

                                                    <td>

                                                        {

                                                            reglement.fournisseur

                                                        }

                                                    </td>

                                                    <td>

                                                        <span
                                                            className="badge badge-primary"
                                                        >

                                                            {

                                                                reglement.montant_facture

                                                            }

                                                            FCFA

                                                        </span>

                                                    </td>

                                                    <td>

                                                        {

                                                            reglement.date_reglement

                                                        }

                                                    </td>

                                                    <td>

                                                        {

                                                            reglement.numero_cheque_ov

                                                        }

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={

                                                                reglement.acquitement === "Terminé"

                                                                ?

                                                                "badge badge-success"

                                                                :

                                                                reglement.acquitement === "En cours"

                                                                ?

                                                                "badge badge-warning"

                                                                :

                                                                "badge badge-danger"

                                                            }
                                                        >

                                                            {

                                                                reglement.acquitement

                                                            }

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <button
                                                            className="btn btn-info btn-sm mr-2"
                                                            onClick={() =>
                                                                ouvrirReglement(reglement)
                                                            }
                                                        >

                                                            <i className="mdi mdi-eye"></i>

                                                        </button>

                                                        <Link
                                                            to={`/paiement-pages/reglement/modifier-reglement/${reglement.id}`}
                                                        >

                                                            <button
                                                                className="btn btn-dark btn-sm mr-2"
                                                            >

                                                                <i className="mdi mdi-pencil"></i>

                                                            </button>

                                                        </Link>

                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                                supprimerReglement(reglement.id)
                                                            }
                                                        >

                                                            <i className="mdi mdi-delete"></i>

                                                        </button>

                                                    </td>

                                                </tr>

                                            ))

                                            :

                                            <tr>

                                                <td
                                                    colSpan="8"
                                                    className="text-center"
                                                >

                                                    Aucun règlement enregistré.

                                                </td>

                                            </tr>

                                        }

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

                        <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                centered
            >

                <Modal.Header closeButton>

                    <Modal.Title>

                        Détails du règlement

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    {

                        reglementSelectionne &&

                        <div className="container-fluid">

                            <div className="row">

                                <div className="col-md-6">

                                    <div className="form-group">

                                        <label><b>Référence facture</b></label>

                                        <input
                                            className="form-control"
                                            value={
                                                reglementSelectionne.reference_facture|| ""
                                            }
                                            readOnly
                                        />

                                    </div>

                                </div>

                                <div className="col-md-6">

                                    <div className="form-group">

                                        <label><b>Référence mémo</b></label>

                                        <input
                                            className="form-control"
                                            value={
                                                reglementSelectionne.reference_memo || ""
                                            }
                                            readOnly
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="row">

                                <div className="col-md-6">

                                    <div className="form-group">

                                        <label><b>Fournisseur</b></label>

                                        <input
                                            className="form-control"
                                            value={
                                                reglementSelectionne.fournisseur || ""
                                            }
                                            readOnly
                                        />

                                    </div>

                                </div>

                                <div className="col-md-6">

                                    <div className="form-group">

                                        <label><b>Montant</b></label>

                                        <input
                                            className="form-control"
                                            value={`${reglementSelectionne.montant_facture || 0} FCFA`}
                                            readOnly
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="row">

                                <div className="col-md-6">

                                    <div className="form-group">

                                        <label><b>Date du règlement</b></label>

                                        <input
                                            className="form-control"
                                            value={reglementSelectionne.date_reglement}
                                            readOnly
                                        />

                                    </div>

                                </div>

                                <div className="col-md-6">

                                    <div className="form-group">

                                        <label><b>N° Chèque / OV</b></label>

                                        <input
                                            className="form-control"
                                            value={reglementSelectionne.numero_cheque_ov}
                                            readOnly
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="row">

                                <div className="col-md-6">

                                    <div className="form-group">

                                        <label><b>Service financier</b></label>

                                        <input
                                            className="form-control"
                                            value={reglementSelectionne.service_financier}
                                            readOnly
                                        />

                                    </div>

                                </div>

                                <div className="col-md-6">

                                    <div className="form-group">

                                        <label><b>Acquitement</b></label>

                                        <input
                                            className="form-control"
                                            value={reglementSelectionne.acquitement}
                                            readOnly
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="row">

                                <div className="col-md-12">

                                    <div className="form-group">

                                        <label><b>Source de financement</b></label>

                                        <input
                                            className="form-control"
                                            value={reglementSelectionne.source_financement}
                                            readOnly
                                        />

                                    </div>

                                </div>

                            </div>

                            {

                                reglementSelectionne.fichier &&

                                <div className="text-center mt-4">

                                    <a
                                        href={`http://127.0.0.1:8000${reglementSelectionne.fichier}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >

                                        <i className="mdi mdi-file-pdf"></i>

                                        &nbsp;

                                        Voir le justificatif

                                    </a>

                                </div>

                            }

                        </div>

                    }

                </Modal.Body>

                <Modal.Footer>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                    >

                        Fermer

                    </button>

                </Modal.Footer>

            </Modal>

        </div>

    );

}

export default ListeReglement;