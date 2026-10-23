import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AxiosInstance from '../Axios';

const Liste = () => {

  const [memos, setMemos] = useState([]);

  useEffect(() => {
    AxiosInstance.get("http://127.0.0.1:8000/memo/")
      .then(res => {
        setMemos(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">Liste de Fournisseur</h3>

        <nav>
          <ol className="breadcrumb">
            {/* <li className="breadcrumb-item">
              <Link to="/memo-pages/formulaire-memo">
                Ajouter
              </Link>
            </li> */}
          </ol>
        </nav>
      </div>

        <div className="row">
            <div className="col-lg-12 grid-margin stretch-card table-striped">

                <div className="card">
                    <div className="card-body">
                    <h4 className="card-title">Fournisseur</h4>

                    <table className="table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Ref memo</th>
                            <th>Objet</th>
                            <th>Source financement</th>
                            <th>Fournisseur</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {memos.map((memo) => (
                            <tr key={memo.id}>
                            <td>{memo.date}</td>
                            <td>{memo.reference_memo}</td>
                            <td>{memo.objet}</td>
                            <td>{memo.source_financement}</td>
                            <td>{memo.fournisseur_choisi_detail ? memo.fournisseur_choisi_detail.agence : "Non choisi"}</td>
                            <td>
                                {/* Voir / modifier */}
                                <Link to={`/fournisseur-pages/formulaire-fournisseur/${memo.id}`}>
                                    <button className="btn btn-dark">
                                        <i className="mdi mdi-file-check"></i>
                                    </button>
                                </Link>

                                {/* Supprimer */}
                                <button className="btn btn-danger">
                                <i className="mdi mdi-delete"></i>
                                </button>

                                {/* CONDITION ICI */}
                                {memo.fournisseur && memo.fournisseur.length > 0 && (
                                    <Link to={`/fournisseur-pages/choice-fournisseur/${memo.id}`}>
                                        <button className="btn btn-primary">
                                        <i className="mdi mdi-select"></i>
                                        </button>
                                    </Link>
                                )}
                            </td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                    </div>
                </div>

            </div>
        </div>

    </div>
  );
};

export default Liste;