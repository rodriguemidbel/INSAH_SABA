// import React, { useState } from 'react';
// import { Form } from 'react-bootstrap';
// import AxiosInstance from '../Axios';

// function ImportBillets() {

//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {

//     setFile(
//       e.target.files[0]
//     );

//   };

//   const handleUpload = async () => {

//     if (!file) {

//       alert(
//         "Veuillez choisir un fichier Excel"
//       );

//       return;

//     }

//     const formData = new FormData();

//     formData.append(
//       "file",
//       file
//     );

//     try {

//       const response = await AxiosInstance.post(

//         "http://127.0.0.1:8000/import-billets/",
//         formData,

//         {
//           headers: {
//             "Content-Type":
//               "multipart/form-data"
//           }
//         }

//       );

//       alert(
//         response.data.message
//       );

//       setFile(null);

//     }

//     catch (error) {

//       console.log(error);

//       alert(
//         "Erreur lors de l'importation"
//       );

//     }

//   };

//   return (

//     <div>

//       {/* ================= HEADER ================= */}

//       <div className="page-header">

//         <h3 className="page-title">
//           Importation des Billets
//         </h3>

//       </div>

//       {/* ================= CARD ================= */}

//       <div className="row">

//         <div className="container">

//           <div className="row justify-content-center">

//             <div className="col-8 grid-margin stretch-card">

//               <div className="card">

//                 <div className="card-body">

//                   <h4 className="card-title">
//                     Import Excel
//                   </h4>

//                   <p className="card-description">
//                     Importer un fichier Excel contenant les billets
//                   </p>

//                   <Form>

//                     {/* ================= FILE ================= */}

//                     <Form.Group>

//                       <label>
//                         Sélectionner le fichier
//                       </label>

//                       <Form.Control
//                         type="file"
//                         accept=".xlsx,.xls"
//                         onChange={handleFileChange}
//                       />

//                     </Form.Group>

//                     {/* ================= ACTIONS ================= */}

//                     <button
//                       type="button"
//                       className="btn btn-primary mr-2 mt-3"
//                       onClick={handleUpload}
//                     >
//                       Importer
//                     </button>

//                     <button
//                       type="button"
//                       className="btn btn-dark mt-3"
//                       onClick={() =>
//                         setFile(null)
//                       }
//                     >
//                       Annuler
//                     </button>

//                   </Form>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>

//   );

// }

// export default ImportBillets;


// import React, { useState } from 'react';

// import {
//   Form,
//   Modal,
//   Table,
//   Button
// } from 'react-bootstrap';

// import AxiosInstance from '../Axios';

// function ImportBillets() {

//   // ================= FILE =================

//   const [file, setFile] = useState(null);

//   // ================= MEMOS =================

//   const [memos, setMemos] = useState([]);

//   // ================= MODAL =================

//   const [showModal, setShowModal] = useState(false);

//   // ================= BILLETS =================

//   const [billets, setBillets] = useState([]);

//   // ================= MEMO SELECT =================

//   const [memoSelectionne, setMemoSelectionne] = useState(null);

//   // ================= FILE CHANGE =================

//   const handleFileChange = (e) => {

//     setFile(
//       e.target.files[0]
//     );

//   };

//   // ================= IMPORT =================

//   const handleUpload = async () => {

//     if (!file) {

//       alert(
//         "Veuillez choisir un fichier Excel"
//       );

//       return;

//     }

//     const formData = new FormData();

//     formData.append(
//       "file",
//       file
//     );

//     try {

//       const response = await AxiosInstance.post(

//         "http://127.0.0.1:8000/import-billets/",
//         formData,

//         {
//           headers: {
//             "Content-Type":
//               "multipart/form-data"
//           }
//         }

//       );

//       alert(
//         response.data.message
//       );

//       // ================= AJOUT MEMO =================

//       if (response.data.memo) {

//         setMemos((prev) => [

//           ...prev,
//           response.data.memo

//         ]);

//       }

//       setFile(null);

//     }

//     catch (error) {

//       console.log(error);

//       alert(
//         "Erreur lors de l'importation"
//       );

//     }

//   };

//   // ================= OUVRIR MODAL =================

//   const ouvrirMemo = async (memo) => {

//     setMemoSelectionne(memo);

//     try {

//       const response = await AxiosInstance.get(

//         `http://127.0.0.1:8000/memo/${memo.id}/`

//       );

//       setBillets(
//         response.data
//       );

//       setShowModal(true);

//     }

//     catch (error) {

//       console.log(error);

//       alert(
//         "Erreur lors du chargement des billets"
//       );

//     }

//   };

//   return (

//     <div>

//       {/* ================= HEADER ================= */}

//       <div className="page-header">

//         <h3 className="page-title">
//           Importation des Billets
//         </h3>

//       </div>

//       {/* ================= FORMULAIRE ================= */}

//       <div className="row">

//         <div className="container">

//           <div className="row justify-content-center">

//             <div className="col-8 grid-margin stretch-card">

//               <div className="card">

//                 <div className="card-body">

//                   <h4 className="card-title">
//                     Import Excel
//                   </h4>

//                   <p className="card-description">
//                     Importer un fichier Excel contenant les billets
//                   </p>

//                   <Form>

//                     {/* ================= FILE ================= */}

//                     <Form.Group>

//                       <label>
//                         Sélectionner le fichier
//                       </label>

//                       <Form.Control
//                         type="file"
//                         accept=".xlsx,.xls"
//                         onChange={handleFileChange}
//                       />

//                     </Form.Group>

//                     {/* ================= ACTIONS ================= */}

//                     <button
//                       type="button"
//                       className="btn btn-primary mr-2 mt-3"
//                       onClick={handleUpload}
//                     >
//                       Importer
//                     </button>

//                     <button
//                       type="button"
//                       className="btn btn-dark mt-3"
//                       onClick={() =>
//                         setFile(null)
//                       }
//                     >
//                       Annuler
//                     </button>

//                   </Form>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* ================= LISTE MEMOS ================= */}

//       <div className="row">

//         <div className="col-lg-12 grid-margin stretch-card">

//           <div className="card">

//             <div className="card-body">

//               <h4 className="card-title">
//                 Memos importés
//               </h4>

//               <div className="table-responsive">

//                 <Table
//                   striped
//                   bordered
//                   hover
//                 >

//                   <thead>

//                     <tr>

//                       <th>
//                         Référence Memo
//                       </th>

//                       <th>
//                         Objet
//                       </th>

//                       <th>
//                         Action
//                       </th>

//                     </tr>

//                   </thead>

//                   <tbody>

//                     {

//                       memos.length > 0 ? (

//                         memos.map((memo, index) => (

//                           <tr key={index}>

//                             <td>
//                               {memo.reference_memo}
//                             </td>

//                             <td>
//                               {memo.objet}
//                             </td>

//                             <td>

//                               <Button
//                                 variant="primary"
//                                 size="sm"
//                                 onClick={() =>
//                                   ouvrirMemo(memo)
//                                 }
//                               >
//                                 Voir billets
//                               </Button>

//                             </td>

//                           </tr>

//                         ))

//                       ) : (

//                         <tr>

//                           <td
//                             colSpan="3"
//                             className="text-center"
//                           >

//                             Aucun memo importé

//                           </td>

//                         </tr>

//                       )

//                     }

//                   </tbody>

//                 </Table>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* ================= MODAL ================= */}

//       <Modal
//         show={showModal}
//         onHide={() =>
//           setShowModal(false)
//         }
//         centered
//         size="xl"
//       >

//         <Modal.Header closeButton>

//           <Modal.Title>

//             Billets du memo :
//             {" "}
//             {
//               memoSelectionne?.reference_memo
//             }

//           </Modal.Title>

//         </Modal.Header>

//         <Modal.Body>

//           <Table
//             striped
//             bordered
//             hover
//             responsive
//           >

//             <thead>

//               <tr>

//                 <th>
//                   Nom
//                 </th>

//                 <th>
//                   Prénom
//                 </th>

//                 <th>
//                   Téléphone
//                 </th>

//                 <th>
//                   Destination
//                 </th>

//                 <th>
//                   Montant
//                 </th>

//               </tr>

//             </thead>

//             <tbody>

//               {

//                 billets.length > 0 ? (

//                   billets.map((billet, index) => (

//                     <tr key={index}>

//                       <td>
//                         {billet.nom}
//                       </td>

//                       <td>
//                         {billet.prenom}
//                       </td>

//                       <td>
//                         {billet.telephone}
//                       </td>

//                       <td>
//                         {billet.destination}
//                       </td>

//                       <td>
//                         {billet.montant}
//                       </td>

//                     </tr>

//                   ))

//                 ) : (

//                   <tr>

//                     <td
//                       colSpan="5"
//                       className="text-center"
//                     >

//                       Aucun billet trouvé

//                     </td>

//                   </tr>

//                 )

//               }

//             </tbody>

//           </Table>

//         </Modal.Body>

//       </Modal>

//     </div>

//   );

// }

// export default ImportBillets;


import React, { useEffect, useState } from 'react';

import {
  Modal,
  Button,
  Form,
  Table
} from 'react-bootstrap';

import AxiosInstance from '../Axios';

function ImportBillets() {

  // ================= MEMOS =================

  const [memos, setMemos] = useState([]);

  // ================= BILLETS =================

  const [billets, setBillets] = useState([]);

  // ================= FILE =================

  const [file, setFile] = useState(null);

  // ================= MEMO SELECTIONNE =================

  const [memoSelectionne, setMemoSelectionne] =
    useState(null);

  // ================= MODAL IMPORT =================

  const [showImportModal, setShowImportModal] =
    useState(false);

  // ================= MODAL BILLETS =================

  const [showBilletsModal, setShowBilletsModal] =
    useState(false);

  // ================= CHARGEMENT MEMOS =================

  useEffect(() => {

    chargerMemos();

  }, []);

  const chargerMemos = async () => {

    try {

      const response =
        await AxiosInstance.get(
          '/memo/'
        );

      setMemos(
        response.data
      );

    }

    catch (error) {

      console.log(error);

    }

  };

  // ================= CHOIX FICHIER =================

  const handleFileChange = (e) => {

    setFile(
      e.target.files[0]
    );

  };

  // ================= OUVERTURE IMPORT =================

  const ouvrirImport = (memo) => {

    setMemoSelectionne(
      memo
    );

    setFile(null);

    setShowImportModal(
      true
    );

  };

  // ================= IMPORTATION =================

  const importerExcel = async () => {

    if (!file) {

      alert(
        'Veuillez choisir un fichier Excel'
      );

      return;

    }

    if (
      !memoSelectionne?.fournisseur_choisi
    ) {

      alert(
        'Aucun fournisseur sélectionné pour ce mémo'
      );

      return;

    }

    const formData =
      new FormData();

    formData.append(
      'file',
      file
    );

    formData.append(
      'memo',
      memoSelectionne.id
    );

    formData.append(
      'fournisseur',
      memoSelectionne.fournisseur_choisi
    );

    try {

      console.log("Memo :", memoSelectionne.id);
      console.log("Fournisseur :", memoSelectionne.fournisseur_choisi);
      const response =
        await AxiosInstance.post(
          '/import-billets/',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data'
            }
          }
        );

      alert(
        response.data.message
      );

      setShowImportModal(
        false
      );

    }

    catch (error) {

      console.log(error);

      alert(
        'Erreur lors de l\'importation'
      );

    }

  };

  // ================= VOIR BILLETS =================

  const voirBillets = async (memo) => {

    try {

      const response =
        await AxiosInstance.get(
          `/billets-par-memo/${memo.id}/`
        );

      setBillets(
        response.data
      );

      setMemoSelectionne(
        memo
      );

      setShowBilletsModal(
        true
      );

    }

    catch (error) {

      console.log(error);

      alert(
        'Erreur chargement billets'
      );

    }

  };

  return (

    <div>

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <h3 className="page-title">

          Importation des Billets

        </h3>

      </div>

      {/* ================= TABLE MEMOS ================= */}

      <div className="row">

        <div className="col-lg-12 grid-margin stretch-card">

          <div className="card">

            <div className="card-body">

              <h4 className="card-title">

                Liste des mémos

              </h4>

              <div className="table-responsive">

                <Table
                  striped
                  bordered
                  hover
                >

                  <thead>

                    <tr>

                      <th>
                        Référence
                      </th>

                      <th>
                        Objet
                      </th>

                      <th>
                        Source financement
                      </th>

                      <th>
                        Fournisseur choisi
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {

                      memos.length > 0 ?

                        memos.map((memo) => (

                          <tr key={memo.id}>

                            <td>

                              {memo.reference_memo}

                            </td>

                            <td>

                              {memo.objet}

                            </td>

                            <td>

                              {memo.source_financement}

                            </td>

                            <td>

                              {
                                memo
                                  .fournisseur_choisi_detail
                                  ?.agence ||
                                'Non choisi'
                              }

                            </td>

                            <td>

                              <Button
                                variant="success"
                                size="sm"
                                onClick={() =>
                                  ouvrirImport(
                                    memo
                                  )
                                }
                              >

                                Importer Excel

                              </Button>

                              <Button
                                variant="primary"
                                size="sm"
                                className="ml-2"
                                onClick={() =>
                                  voirBillets(
                                    memo
                                  )
                                }
                              >

                                Voir Billets

                              </Button>

                            </td>

                          </tr>

                        ))

                        :

                        <tr>

                          <td
                            colSpan="5"
                            className="text-center"
                          >

                            Aucun mémo trouvé

                          </td>

                        </tr>

                    }

                  </tbody>

                </Table>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= MODAL IMPORT ================= */}

      <Modal
        show={showImportModal}
        onHide={() =>
          setShowImportModal(false)
        }
        centered
      >

        <Modal.Header closeButton>

          <Modal.Title>

            Import Excel

          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <p>

            Mémo :

            <strong>

              {' '}
              {
                memoSelectionne
                  ?.reference_memo
              }

            </strong>

          </p>

          <Form.Group>

            <label>

              Fichier Excel

            </label>

            <Form.Control
              type="file"
              accept=".xlsx,.xls"
              onChange={
                handleFileChange
              }
            />

          </Form.Group>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() =>
              setShowImportModal(false)
            }
          >

            Fermer

          </Button>

          <Button
            variant="success"
            onClick={
              importerExcel
            }
          >

            Importer

          </Button>

        </Modal.Footer>

      </Modal>

      {/* ================= MODAL BILLETS ================= */}

      <Modal
        show={showBilletsModal}
        onHide={() =>
          setShowBilletsModal(false)
        }
        size="xl"
      >

        <Modal.Header closeButton>

          <Modal.Title>

            Billets du mémo

            {' '}

            {
              memoSelectionne
                ?.reference_memo
            }

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

                <th>Nom</th>

                <th>Prénom</th>

                <th>Téléphone</th>

                <th>Destination</th>

                <th>Montant</th>

              </tr>

            </thead>

            <tbody>

              {

                billets.length > 0 ?

                  billets.map(
                    (billet) => (

                      <tr
                        key={
                          billet.id
                        }
                      >

                        <td>
                          {billet.nom}
                        </td>

                        <td>
                          {billet.prenom}
                        </td>

                        <td>
                          {billet.telephone}
                        </td>

                        <td>
                          {billet.destination}
                        </td>

                        <td>
                          {billet.montant}
                        </td>

                      </tr>

                    )
                  )

                  :

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center"
                    >

                      Aucun billet trouvé

                    </td>

                  </tr>

              }

            </tbody>

          </Table>

        </Modal.Body>

      </Modal>

    </div>

  );

}

export default ImportBillets;