import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Modal,
  Button,
  Table
} from 'react-bootstrap';

import AxiosInstance from '../Axios';

function Liste() {

  const history = useHistory();

  // ================= BONS =================

  const [bons, setBons] = useState([]);

  // ================= MEMOS =================

  const [memos, setMemos] = useState([]);

  // ================= MODAL =================

  const [showModal, setShowModal] = useState(false);

  // ================= LOAD =================

  useEffect(() => {

    chargerBons();

    chargerMemos();

  }, []);

  // ================= CHARGER BONS =================

  const chargerBons = () => {

    AxiosInstance.get("http://127.0.0.1:8000/bon/")
      .then((res) => {

        // console.log(res.data)

        setBons(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

  };

  // ================= CHARGER MEMOS =================

  const chargerMemos = () => {

    AxiosInstance.get("http://127.0.0.1:8000/memo/")
      .then((res) => {

        setMemos(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

  };

  // ================= CHOISIR MEMO =================

  const choisirMemo = (memo) => {

    setShowModal(false);

    history.push({
      pathname: "/bon-pages/formulaire-bon",
      state: {
        memo: memo
      }
    });

  };

  // ================= DELETE =================

  const supprimerBon = (id) => {

    if (window.confirm("Voulez-vous supprimer ce bon ?")) {

      AxiosInstance.delete(`http://127.0.0.1:8000/bon/${id}/`)
        .then(() => {

          setBons(
            bons.filter((bon) => bon.id !== id)
          );

        })
        .catch((err) => {

          console.log(err);

        });

    }

  };

  return (

    <div>

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <h3 className="page-title">
          Liste de Bon de commande
        </h3>

        <nav aria-label="breadcrumb">

          <ol className="breadcrumb">

            <li className="breadcrumb-item">

              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Ajouter
              </button>

            </li>

          </ol>

        </nav>

      </div>

      {/* ================= TABLE ================= */}

      <div className="row">

        <div className="col-lg-12 grid-margin stretch-card table-striped">

          <div className="card">

            <div className="card-body">

              <h4 className="card-title">
                Bon de commande
              </h4>

              <div className="table-responsive">

                <table className="table table-striped">

                  <thead>

                    <tr>

                      <th>Date</th>

                      <th>Reference Memo</th>

                      <th>Reference Bon</th>

                      <th>Année Exercice</th>

                      <th>Objet</th>

                      <th>Source financement</th>

                      <th>Fournisseur</th>

                      <th>Actions</th>

                    </tr>

                  </thead>

                  <tbody>

                    {

                      bons.length > 0 ? (

                        bons.map((bon) => (

                          <tr key={bon.id}>

                            {/* DATE */}

                            <td>
                              {bon.date}
                            </td>

                            {/* REF MEMO */}

                            <td>
                                {
                                    bon.memo_reference
                                    ? bon.memo_reference
                                    : "Aucun memo"
                                }
                            </td>

                            {/* REF BON */}

                            <td>
                              {bon.reference_bon}
                            </td>

                            {/* ANNEE */}

                            <td>
                              {bon.annee_exercice}
                            </td>

                            {/* OBJET */}

                            <td>
                              {bon.objet}
                            </td>

                            {/* SOURCE */}

                            <td>
                              {bon.source_financement}
                            </td>

                            {/* FOURNISSEUR */}

                            <td>

                              {
                                bon.fournisseur_nom
                                  ? bon.fournisseur_nom
                                  : "Aucun fournisseur"
                              }

                            </td>

                            {/* ACTIONS */}

                            <td>

                              {/* MODIFIER */}

                              <Link
                                to={`/bon-pages/modifier-bon/${bon.id}`}
                              >

                                <button
                                  type="button"
                                  className="btn btn-dark btn-icon-text me-2"
                                >

                                  <i className="mdi mdi-file-check btn-icon-append"></i>

                                </button>

                              </Link>

                              {/* SUPPRIMER */}

                              <button
                                type="button"
                                className="btn btn-danger btn-icon-text"
                                onClick={() => supprimerBon(bon.id)}
                              >

                                <i className="mdi mdi-delete"></i>

                              </button>

                            </td>

                          </tr>

                        ))

                      ) : (

                        <tr>

                          <td colSpan="8">

                            <div className="alert alert-warning text-center">

                              Aucun bon de commande enregistré.

                            </div>

                          </td>

                        </tr>

                      )

                    }

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= MODAL MEMO ================= */}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >

        <Modal.Header closeButton>

          <Modal.Title>

            Sélection du Memo

          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <Table
            striped
            bordered
            hover
            responsive
          >

            <thead>

              <tr>

                <th>Reference</th>

                <th>Date</th>

                <th>Objet</th>

                <th>Fournisseur</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {

                memos.length > 0 ? (

                  memos.map((memo) => (

                    <tr key={memo.id}>

                      <td>
                        {memo.reference_memo}
                      </td>

                      <td>
                        {memo.date}
                      </td>

                      <td>
                        {memo.objet}
                      </td>

                      {/* FOURNISSEUR */}

                      <td>

                        {
                          memo.fournisseur_choisi_detail
                            ? memo.fournisseur_choisi_detail.agence
                            : "Aucun fournisseur"
                        }

                      </td>

                      <td>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => choisirMemo(memo)}
                        >
                          Choisir
                        </Button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td colSpan="5">

                      <div className="alert alert-warning text-center">

                        Aucun memo disponible.

                      </div>

                    </td>

                  </tr>

                )

              }

            </tbody>

          </Table>

        </Modal.Body>

      </Modal>

    </div>

  );

}

export default Liste;