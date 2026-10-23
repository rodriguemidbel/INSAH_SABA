import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../Axios";

function Liste() {

    const [memos, setMemos] = useState([]);

    useEffect(() => {
        chargerMemos();
    }, []);

    const chargerMemos = () => {
        AxiosInstance.get("http://127.0.0.1:8000/memo/")
            .then((res) => {
                setMemos(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const supprimerMemo = (id) => {

        if (!window.confirm("Voulez-vous vraiment supprimer ce mémo ?")) {
            return;
        }

        AxiosInstance.delete(`http://127.0.0.1:8000/memo/${id}/`)
            .then(() => {
                setMemos(memos.filter((memo) => memo.id !== id));
            })
            .catch((err) => {
                console.log(err);
            });

    };

    const BASE_URL = "http://127.0.0.1:8000";

    return (
        <div>

            <div className="page-header">
                <h3 className="page-title">
                    Liste des mémos
                </h3>

                <nav>
                    <Link
                        to="/memo-pages/formulaire-memo"
                        className="btn btn-success"
                    >
                        <i className="mdi mdi-plus"></i> Nouveau mémo
                    </Link>
                </nav>
            </div>

            <div className="card shadow">

                <div className="card-body">

                    <h4 className="card-title mb-4">
                        Mémos enregistrés
                    </h4>

                    <div className="table-responsive">

                        <table className="table table-hover table-striped">

                            <thead className="thead-dark">

                                <tr>
                                    <th>Date</th>
                                    <th>Référence</th>
                                    <th>Objet</th>
                                    <th>Source financement</th>
                                    <th width="180">Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {memos.length === 0 ? (

                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            Aucun mémo disponible.
                                        </td>
                                    </tr>

                                ) : (

                                    memos.map((memo) => (

                                      

                                        <tr key={memo.id}>

                                            <td>{memo.date}</td>

                                            <td>
                                                <strong>{memo.reference_memo}</strong>
                                            </td>

                                            <td>{memo.objet}</td>

                                            <td>{memo.source_financement}</td>

                                            {/* <td>{memo.fichier}</td> */}

                                            <td>

                                                {/* Modifier */}
                                                <Link
                                                    to={`/memo-pages/modifier-memo/${memo.id}`}
                                                    className="btn btn-warning btn-sm mr-2"
                                                    title="Modifier"
                                                >
                                                    <i className="mdi mdi-pencil"></i>
                                                </Link>

                                                {/* Supprimer */}
                                                <button
                                                    className="btn btn-danger btn-sm mr-2"
                                                    title="Supprimer"
                                                    onClick={() => supprimerMemo(memo.id)}
                                                >
                                                    <i className="mdi mdi-delete"></i>
                                                </button>

                                                {/* Lire le fichier */}
                                                {memo.fichier ? (

                                                    <a
                                                        href={`${BASE_URL}${memo.fichier}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-info btn-sm"
                                                        title="Ouvrir le fichier"
                                                    >
                                                        <i className="mdi mdi-file-pdf"></i>
                                                    </a>

                                                ) : (

                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        disabled
                                                        title="Aucun fichier"
                                                    >
                                                        <i className="mdi mdi-file-outline"></i>
                                                    </button>

                                                )}

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Liste;