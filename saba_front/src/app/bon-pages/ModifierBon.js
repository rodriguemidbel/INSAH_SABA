import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import bsCustomFileInput from 'bs-custom-file-input';
import AxiosInstance from '../Axios';

import {
  useHistory,
  useParams
} from "react-router-dom";

function Formulaire() {

  const history = useHistory();

  const { id } = useParams();

  // ================= DATE =================

  const [dateBon, setDateBon] = useState(
    new Date()
  );

  // ================= BON =================

  const [bon, setBon] = useState({

    memo: "",
    fournisseur: "",
    reference_bon: "",
    annee_exercice: "",
    fichier: null

  });

  // ================= INIT =================

  useEffect(() => {

    bsCustomFileInput.init();

    chargerBon();

  }, []);

  // ================= LOAD BON =================

  const chargerBon = () => {

    AxiosInstance
      .get(`http://127.0.0.1:8000/bon/${id}/`)

      .then((res) => {

        console.log(res.data);

        const data = res.data;

        // ================= SET BON =================

        setBon({

          memo: data.memo || "",
          fournisseur: data.fournisseur || "",
          reference_bon: data.reference_bon || "",
          annee_exercice: data.annee_exercice || "",
          fichier: null

        });

        // ================= DATE =================

        if (data.date) {

          setDateBon(
            new Date(data.date)
          );

        }

      })

      .catch((err) => {

        console.log(err);

      });

  };

  // ================= CHANGE =================

  const handleChange = (e) => {

    setBon({

      ...bon,
      [e.target.name]: e.target.value

    });

  };

  // ================= FILE =================

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

    // ================= RELATIONS =================

    formData.append(
      "memo",
      bon.memo
    );

    formData.append(
      "fournisseur",
      bon.fournisseur
    );

    // ================= BON =================

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

    // ================= FILE =================

    if (bon.fichier) {

      formData.append(
        "fichier",
        bon.fichier
      );

    }

    // ================= UPDATE =================

    AxiosInstance.put(

      `http://127.0.0.1:8000/bon/${id}/`,
      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data"
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

  };

  return (

    <div>

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <h3 className="page-title">
          Modification de Bon de commande
        </h3>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="row">

        <div className="container">

          <div className="row justify-content-center">

            <div className="col-8 grid-margin stretch-card">

              <div className="card">

                <div className="card-body">

                  <h4 className="card-title">
                    Update Bon
                  </h4>

                  <form
                    className="forms-sample"
                    onSubmit={handleSubmit}
                  >

                    {/* ================= HIDDEN ================= */}

                    <Form.Control
                      type="hidden"
                      name="memo"
                      value={bon.memo}
                    />

                    <Form.Control
                      type="hidden"
                      name="fournisseur"
                      value={bon.fournisseur}
                    />

                    {/* ================= REFERENCE ================= */}

                    <Form.Group>

                      <label>
                        Référence Bon
                      </label>

                      <Form.Control
                        type="text"
                        name="reference_bon"
                        value={bon.reference_bon}
                        onChange={handleChange}
                      />

                    </Form.Group>

                    {/* ================= DATE ================= */}

                    <Form.Group>

                      <label>
                        Date Bon
                      </label>

                      <DatePicker
                        className="form-control"
                        selected={dateBon}
                        onChange={(date) =>
                          setDateBon(date)
                        }
                      />

                    </Form.Group>

                    {/* ================= ANNEE ================= */}

                    <Form.Group>

                      <label>
                        Année Exercice
                      </label>

                      <Form.Control
                        type="text"
                        name="annee_exercice"
                        value={bon.annee_exercice}
                        onChange={handleChange}
                      />

                    </Form.Group>

                    {/* ================= FILE ================= */}

                    <Form.Group>

                      <label>
                        Téléverser Fichier
                      </label>

                      <div className="custom-file">

                        <Form.Control
                          type="file"
                          className="form-control"
                          onChange={handleFileChange}
                        />

                      </div>

                    </Form.Group>

                    {/* ================= BUTTONS ================= */}

                    <button
                      type="submit"
                      className="btn btn-primary mr-2"
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() =>
                        history.push(
                          "/bon-pages/liste-bon"
                        )
                      }
                    >
                      Cancel
                    </button>

                  </form>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Formulaire;