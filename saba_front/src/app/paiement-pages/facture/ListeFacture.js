import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import AxiosInstance from "../../Axios";

function ListeFacture() {

    // ==========================
    // STATES
    // ==========================

    const [memos, setMemos] = useState([]);
    const [factures, setFactures] = useState([]);
    const [memoSelectionne, setMemoSelectionne] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [loadingFactures, setLoadingFactures] = useState(false);


    // ==========================
    // CHARGEMENT INITIAL
    // ==========================

    useEffect(() => {

        chargerMemos();

    }, []);


    // ==========================
    // CHARGER LES MEMOS
    // ==========================

    const chargerMemos = () => {

        AxiosInstance
            .get("memo/")
            .then((res) => {

                setMemos(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    };


    // ==========================
    // CHARGER LES FACTURES
    // ==========================

    const chargerFactures = (memoId) => {

        setLoadingFactures(true);

        AxiosInstance
            .get(`memo/${memoId}/`)
            .then((res) => {

                setFactures(res.data.factures || []);

            })
            .catch((err) => {

                console.log(err);

            })
            .finally(() => {

                setLoadingFactures(false);

            });

    };


    // ==========================
    // OUVRIR LE MODAL
    // ==========================

    const ouvrirFactures = (memo) => {

        setMemoSelectionne(memo);

        setShowModal(true);

        chargerFactures(memo.id);

    };


    // ==========================
    // FERMER LE MODAL
    // ==========================

    const fermerFactures = () => {

        setShowModal(false);

        setMemoSelectionne(null);

        setFactures([]);

        chargerMemos();

    };


    // ==========================
    // SUPPRIMER MEMO
    // ==========================

    const supprimerMemo = (id) => {

        if (!window.confirm("Voulez-vous supprimer ce mémo ?")) {

            return;

        }

        AxiosInstance
            .delete(`memo/${id}/`)
            .then(() => {

                chargerMemos();

            })
            .catch((err) => {

                console.log(err);

            });

    };


    // ==========================
    // SUPPRIMER FACTURE
    // ==========================

    const supprimerFacture = (id) => {

        if (!window.confirm("Voulez-vous supprimer cette facture ?")) {

            return;

        }

        AxiosInstance
            .delete(`facture/${id}/`)
            .then(() => {

                if (memoSelectionne) {

                    chargerFactures(memoSelectionne.id);

                }

                chargerMemos();

            })
            .catch((err) => {

                console.log(err);

            });

    };


    // ==========================
    // OUVRIR PDF
    // ==========================

    const ouvrirFacture = (facture) => {

        if (!facture.fichier) {

            return;

        }

        window.open(
            `http://127.0.0.1:8000${facture.fichier}`,
            "_blank"
        );

    };


    return (

        <div>

    <div className="page-header">

        <h3 className="page-title">
            Gestion des factures
        </h3>

        <nav aria-label="breadcrumb">

            <ol className="breadcrumb">

                <li className="breadcrumb-item">

                    <Link
                        to="/memo-pages/formulaire-memo"
                    >

                        Ajouter un mémo

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

                        Liste des mémos

                    </h4>

                    <div className="table-responsive">

                        <table className="table table-hover">

                            <thead className="thead-dark">

                                <tr>

                                    <th>Référence</th>

                                    <th>Date</th>

                                    <th>Objet</th>

                                    <th>Financement</th>

                                    <th>Fournisseur</th>

                                    <th>Factures</th>

                                    <th width="190">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    memos.length === 0 ?

                                    (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="text-center"
                                            >

                                                Aucun mémo enregistré.

                                            </td>

                                        </tr>

                                    )

                                    :

                                    (

                                        memos.map((memo) => (

                                            <tr key={memo.id}>

                                                <td>

                                                    <strong>

                                                        {
                                                            memo.reference_memo
                                                        }

                                                    </strong>

                                                </td>

                                                <td>

                                                    {
                                                        memo.date
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        memo.objet
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        memo.source_financement
                                                    }

                                                </td>

                                                <td>

                                                    {

                                                        memo.fournisseur_choisi_detail

                                                            ?

                                                            memo.fournisseur_choisi_detail.agence

                                                            :

                                                            "-"

                                                    }

                                                </td>

                                                <td>

                                                    <span

                                                        className={

                                                            memo.factures?.length > 0

                                                                ?

                                                                "badge badge-success"

                                                                :

                                                                "badge badge-danger"

                                                        }

                                                    >

                                                        {

                                                            memo.factures?.length || 0

                                                        }

                                                    </span>

                                                </td>

                                                <td>

                                                    <button

                                                        className="btn btn-info btn-sm mr-2"

                                                        title="Voir"

                                                        onClick={() => ouvrirFactures(memo)}

                                                    >

                                                        <i className="mdi mdi-eye"></i>

                                                    </button>

                                                    <Link

                                                        to={`/paiement-pages/facture/formulaire-facture/${memo.id}`}

                                                    >

                                                        <button

                                                            className="btn btn-success btn-sm mr-2"

                                                            title="Ajouter"

                                                        >

                                                            <i className="mdi mdi-plus"></i>

                                                        </button>

                                                    </Link>

                                                    <button

                                                        className="btn btn-danger btn-sm"

                                                        title="Supprimer"

                                                        onClick={() => supprimerMemo(memo.id)}

                                                    >

                                                        <i className="mdi mdi-delete"></i>

                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    )

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
            onHide={fermerFactures}
            size="xl"
            centered
        >

            <Modal.Header closeButton>

                <Modal.Title>

                    Factures du mémo

                    <span className="text-primary ml-2">

                        {memoSelectionne?.reference_memo}

                    </span>

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                {

                    loadingFactures ?

                    (

                        <div className="text-center p-5">

                            <div className="spinner-border text-primary"></div>

                            <h5 className="mt-3">

                                Chargement...

                            </h5>

                        </div>

                    )

                    :

                    factures.length === 0 ?

                    (

                        <div className="text-center p-5">

                            <i
                                className="mdi mdi-file-document-outline"
                                style={{
                                    fontSize: 70,
                                    color: "#bbbbbb"
                                }}
                            />

                            <h5 className="mt-3">

                                Aucune facture enregistrée

                            </h5>

                            <p className="text-muted">

                                Ce mémo ne possède aucune facture.

                            </p>

                            <Link
                                to={`/paiement-pages/facture/formulaire-facture/${memoSelectionne?.id}`}
                            >

                                <button
                                    className="btn btn-success"
                                >

                                    <i className="mdi mdi-plus"></i>

                                    &nbsp;

                                    Ajouter une facture

                                </button>

                            </Link>

                        </div>

                    )

                    :

                    (

                        <div className="table-responsive">

                            <table className="table table-bordered table-hover">

                                <thead className="thead-dark">

                                    <tr>

                                        <th>Référence</th>

                                        <th>Date</th>

                                        <th>Montant</th>

                                        <th>Statut</th>

                                        <th width="250">

                                            Actions

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        factures.map((facture) => (

                                            <tr key={facture.id}>

                                                <td>

                                                    <strong>

                                                        {facture.reference_facture}

                                                    </strong>

                                                </td>

                                                <td>

                                                    {facture.date_facture}

                                                </td>

                                                <td>

                                                    {Number(facture.montant).toLocaleString()}

                                                    {" "}FCFA

                                                </td>

                                                <td>

                                                    {

                                                        facture.statut === "Payee"

                                                            ?

                                                            <span className="badge badge-success">

                                                                Réglée

                                                            </span>

                                                            :

                                                            <span className="badge badge-warning">

                                                                Impayée

                                                            </span>

                                                    }

                                                </td>

                                                <td>

                                                    {

                                                        facture.fichier &&

                                                        <button
                                                            className="btn btn-info btn-sm mr-1"
                                                            title="Voir le PDF"
                                                            onClick={() => ouvrirFacture(facture)}
                                                        >

                                                            <i className="mdi mdi-file-pdf"></i>

                                                        </button>

                                                    }

                                                    {

                                                        facture.statut !== "Payee" &&

                                                        <Link
                                                            to={`/paiement-pages/reglement/formulaire-reglement/${facture.id}`}
                                                        >

                                                            <button
                                                                className="btn btn-success btn-sm mr-1"
                                                                title="Régler"
                                                            >

                                                                <i className="mdi mdi-cash"></i>

                                                            </button>

                                                        </Link>

                                                    }

                                                    <Link
                                                        to={`/paiement-pages/facture/modifier-facture/${facture.id}`}
                                                    >

                                                        <button
                                                            className="btn btn-dark btn-sm mr-1"
                                                            title="Modifier"
                                                        >

                                                            <i className="mdi mdi-pencil"></i>

                                                        </button>

                                                    </Link>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        title="Supprimer"
                                                        onClick={() => supprimerFacture(facture.id)}
                                                    >

                                                        <i className="mdi mdi-delete"></i>

                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        </div>

                    )

                }

            </Modal.Body>

        </Modal>

            </div>

);

}

export default ListeFacture;