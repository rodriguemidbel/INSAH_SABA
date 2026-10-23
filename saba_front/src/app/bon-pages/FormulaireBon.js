import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import bsCustomFileInput from 'bs-custom-file-input';
import AxiosInstance from '../Axios';
import {
  useHistory,
  useParams,
  useLocation
} from "react-router-dom";

function Formulaire() {

  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();

  // ================= DATE =================

  const [dateBon, setDateBon] = useState(new Date());

  // ================= MEMO =================

  const [memo, setMemo] = useState({
    id: "",
    reference_memo: "",
    objet: "",
    source_financement: "",
    date: ""
  });

  // ================= FOURNISSEUR =================

  const [fournisseur, setFournisseur] = useState({
    id: "",
    agence: "",
    montant: ""
  });

  // ================= BON =================

  const [bon, setBon] = useState({
    reference_bon: "",
    annee_exercice: "",
    fichier: null
  });

  // ================= INIT =================

  useEffect(() => {

    bsCustomFileInput.init();

  }, []);

  // =========================================================
  // ================= CHARGER MEMO DEPUIS MODAL =============
  // =========================================================

  useEffect(() => {

    if (location.state?.memo) {

      const memoData = location.state.memo;

      console.log("MEMO RECUPERE :", memoData);

      // ================= MEMO =================

      setMemo({
        id: memoData.id || "",
        reference_memo: memoData.reference_memo || "",
        objet: memoData.objet || "",
        source_financement: memoData.source_financement || "",
        date: memoData.date || ""
      });

      // ================= FOURNISSEUR =================

      if (memoData.fournisseur_choisi_detail) {

        setFournisseur({
          id: memoData.fournisseur_choisi_detail.id || "",
          agence:
            memoData.fournisseur_choisi_detail.agence || "",
          montant:
            memoData.fournisseur_choisi_detail.montant || ""
        });

      } else {

        setFournisseur({
          id: "",
          agence: "Aucun fournisseur",
          montant: ""
        });

      }

    }

  }, [location.state]);

  // =========================================================
  // ================= CHARGER BON SI MODIFICATION ===========
  // =========================================================

  useEffect(() => {

    if (id) {

      AxiosInstance.get(`/bon/${id}/`)
        .then((res) => {

          const data = res.data;

          console.log("BON :", data);

          // ================= MEMO =================

          setMemo({
            id: data.memo?.id || "",
            reference_memo:
              data.memo?.reference_memo || "",
            objet: data.memo?.objet || "",
            source_financement:
              data.memo?.source_financement || "",
            date: data.memo?.date || ""
          });

          // ================= FOURNISSEUR =================

          if (data.fournisseur) {

            setFournisseur({
              id: data.fournisseur.id || "",
              agence:
                data.fournisseur.agence || "",
              montant:
                data.fournisseur.montant || ""
            });

          }

          // ================= BON =================

          setBon({
            reference_bon:
              data.reference_bon || "",
            annee_exercice:
              data.annee_exercice || "",
            fichier: null
          });

          // ================= DATE =================

          if (data.date) {

            setDateBon(new Date(data.date));

          }

        })
        .catch((err) => {

          console.log(err);

        });

    }

  }, [id]);

  // ================= HANDLE CHANGE =================

  const handleBonChange = (e) => {

    setBon({
      ...bon,
      [e.target.name]: e.target.value
    });

  };

  // ================= FILE CHANGE =================

  const handleFileChange = (e) => {

    setBon({
      ...bon,
      fichier: e.target.files[0]
    });

  };

  // ================= SUBMIT =================

  const handleSubmit = (e) => {

    e.preventDefault();

    const formData = new FormData();

    // ================= IMPORTANT =================

    formData.append("memo", memo.id);

    formData.append(
      "fournisseur",
      fournisseur.id
    );

    formData.append(
      "reference_bon",
      bon.reference_bon
    );

    formData.append(
      "annee_exercice",
      bon.annee_exercice
    );

    formData.append(
      "date",
      dateBon.toISOString().split("T")[0]
    );

    // ================= FICHIER =================

    if (bon.fichier) {

      formData.append(
        "fichier",
        bon.fichier
      );

    }

    // =================================================
    // ================= CREATION ======================
    // =================================================

    if (!id) {

      AxiosInstance.post(
        "/bon/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      )
      .then(() => {

        alert(
          "Bon de commande créé avec succès"
        );

        history.push(
          "/bon-pages/liste-bon"
        );

      })
      .catch((err) => {

        console.log(
          err.response?.data
        );

      });

    }

    // =================================================
    // ================= MODIFICATION ==================
    // =================================================

    else {

      AxiosInstance.put(
        `/bon/${id}/`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      )
      .then(() => {

        alert(
          "Bon modifié avec succès"
        );

        history.push(
          "/bon-pages/liste-bon"
        );

      })
      .catch((err) => {

        console.log(
          err.response?.data
        );

      });

    }

  };

  // =========================================================
  // ======================== VIEW ===========================
  // =========================================================

  return (

    <div>

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <h3 className="page-title">

          {
            id
            ? "Modification Bon"
            : "Enregistrement Bon"
          }

        </h3>

      </div>

      {/* ================= CARD ================= */}

      <div className="card">

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* ================================================= */}
              {/* ================= PARTIE MEMO =================== */}
              {/* ================================================= */}

              <div
                className="col-md-6"
                style={{
                  borderRight:
                    "2px solid #ccc"
                }}
              >

                <h4 className="mb-4">

                  Informations Memo

                </h4>

                {/* REFERENCE */}

                <Form.Group className="mb-3">

                  <label>
                    Référence Memo
                  </label>

                  <Form.Control
                    type="text"
                    value={
                      memo.reference_memo
                    }
                    disabled
                  />

                </Form.Group>

                {/* DATE */}

                <Form.Group className="mb-3">

                  <label>Date</label>

                  <Form.Control
                    type="text"
                    value={memo.date}
                    disabled
                  />

                </Form.Group>

                {/* SOURCE */}

                <Form.Group className="mb-3">

                  <label>
                    Source financement
                  </label>

                  <Form.Control
                    type="text"
                    value={
                      memo.source_financement
                    }
                    disabled
                  />

                </Form.Group>

                {/* OBJET */}

                <Form.Group className="mb-3">

                  <label>Objet</label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={memo.objet}
                    disabled
                  />

                </Form.Group>

                <hr />

                {/* ================================================= */}
                {/* ================= FOURNISSEUR ================== */}
                {/* ================================================= */}

                <h4 className="mb-4">

                  Fournisseur choisi

                </h4>

                {/* AGENCE */}

                <Form.Group className="mb-3">

                  <label>Agence</label>

                  <Form.Control
                    type="text"
                    value={
                      fournisseur.agence
                    }
                    disabled
                  />

                </Form.Group>

                {/* MONTANT */}

                <Form.Group className="mb-3">

                  <label>Montant</label>

                  <Form.Control
                    type="text"
                    value={
                      fournisseur.montant
                    }
                    disabled
                  />

                </Form.Group>

              </div>

              {/* ================================================= */}
              {/* ================= PARTIE BON ==================== */}
              {/* ================================================= */}

              <div className="col-md-6">

                <h4 className="mb-4">

                  Informations Bon

                </h4>

                {/* REFERENCE BON */}

                <Form.Group className="mb-3">

                  <label>
                    Référence Bon
                  </label>

                  <Form.Control
                    type="text"
                    name="reference_bon"
                    value={
                      bon.reference_bon
                    }
                    onChange={
                      handleBonChange
                    }
                    required
                  />

                </Form.Group>

                {/* DATE */}

                <Form.Group className="mb-3">

                  <label>Date</label>

                  <DatePicker
                    className="form-control"
                    selected={dateBon}
                    onChange={(date) =>
                      setDateBon(date)
                    }
                    dateFormat="yyyy-MM-dd"
                  />

                </Form.Group>

                {/* ANNEE */}

                <Form.Group className="mb-3">

                  <label>
                    Année exercice
                  </label>

                  <Form.Control
                    type="text"
                    name="annee_exercice"
                    value={
                      bon.annee_exercice
                    }
                    onChange={
                      handleBonChange
                    }
                    required
                  />

                </Form.Group>

                {/* FICHIER */}

                <Form.Group className="mb-4">

                  <label>Fichier</label>

                  <Form.Control
                    type="file"
                    onChange={
                      handleFileChange
                    }
                  />

                </Form.Group>

              </div>

            </div>

            {/* ================= BOUTONS ================= */}

            <button
              type="submit"
              className="btn btn-primary mt-3 me-2"
            >
              Enregistrer
            </button>

            <button
              type="button"
              className="btn btn-dark mt-3"
              onClick={() =>
                history.push(
                  "/bon-pages/liste-bon"
                )
              }
            >
              Annuler
            </button>

          </form>

        </div>

      </div>

    </div>

  );

}

export default Formulaire;