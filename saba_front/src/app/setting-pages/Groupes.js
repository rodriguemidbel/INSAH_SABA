import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
  Badge
} from "react-bootstrap";

import AxiosInstance from "../Axios";

function Groupes() {
  // ==========================================
  // ÉTATS
  // ==========================================

  const [groupes, setGroupes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suppressionEnCours, setSuppressionEnCours] = useState(null);

  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [recherche, setRecherche] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modeModification, setModeModification] = useState(false);
  const [groupeId, setGroupeId] = useState(null);

  const [formData, setFormData] = useState({
    group_name: "",
    group_desc: ""
  });

  // ==========================================
  // EXTRACTION DES ERREURS
  // ==========================================

  const extraireErreur = (error, messageDefaut) => {
    const data = error.response?.data;

    if (!data) {
      return messageDefaut;
    }

    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "object") {
      return Object.entries(data)
        .map(([champ, valeur]) => {
          const texte = Array.isArray(valeur)
            ? valeur.join(" ")
            : typeof valeur === "string"
              ? valeur
              : JSON.stringify(valeur);

          return `${champ} : ${texte}`;
        })
        .join(" | ") || messageDefaut;
    }

    return messageDefaut;
  };

  // ==========================================
  // CHARGEMENT DES GROUPES
  // ==========================================

  const chargerGroupes = async () => {
    setLoading(true);
    setErreur("");

    try {
      const response = await AxiosInstance.get("/usergroups/");

      const donnees = response.data;

      setGroupes(
        Array.isArray(donnees)
          ? donnees
          : donnees.results || []
      );
    } catch (error) {
      console.error(
        "Erreur de chargement des groupes :",
        error
      );

      setErreur(
        extraireErreur(
          error,
          "Impossible de charger les groupes. Vérifie ta connexion et tes permissions."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerGroupes();
  }, []);

  // ==========================================
  // FORMULAIRE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const ouvrirCreation = () => {
    setModeModification(false);
    setGroupeId(null);

    setFormData({
      group_name: "",
      group_desc: ""
    });

    setErreur("");
    setMessage("");
    setShowModal(true);
  };

  const ouvrirModification = (groupe) => {
    setModeModification(true);
    setGroupeId(groupe.id);

    setFormData({
      group_name: groupe.group_name || "",
      group_desc: groupe.group_desc || ""
    });

    setErreur("");
    setMessage("");
    setShowModal(true);
  };

  const fermerModal = () => {
    if (saving) return;

    setShowModal(false);
    setErreur("");
  };

  // ==========================================
  // CRÉATION / MODIFICATION
  // ==========================================

  const enregistrerGroupe = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");

    if (!formData.group_name.trim()) {
      setErreur("Le nom du groupe est obligatoire.");
      return;
    }

    const donnees = {
      group_name: formData.group_name.trim(),
      group_desc: formData.group_desc.trim()
    };

    setSaving(true);

    try {
      if (modeModification) {
        await AxiosInstance.patch(
          `/usergroups/${groupeId}/`,
          donnees
        );

        setMessage("Le groupe a été modifié avec succès.");
      } else {
        await AxiosInstance.post("/usergroups/", donnees);

        setMessage("Le groupe a été créé avec succès.");
      }

      setShowModal(false);

      await chargerGroupes();

      setMessage(
        modeModification
          ? "Le groupe a été modifié avec succès."
          : "Le groupe a été créé avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur d'enregistrement du groupe :",
        error
      );

      setErreur(
        extraireErreur(
          error,
          "Impossible d'enregistrer le groupe."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // SUPPRESSION
  // ==========================================

  const supprimerGroupe = async (groupe) => {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer le groupe "${groupe.group_name}" ?`
    );

    if (!confirmation) return;

    setErreur("");
    setMessage("");
    setSuppressionEnCours(groupe.id);

    try {
      await AxiosInstance.delete(
        `/usergroups/${groupe.id}/`
      );

      setGroupes((previous) =>
        previous.filter((item) => item.id !== groupe.id)
      );

      setMessage("Le groupe a été supprimé avec succès.");
    } catch (error) {
      console.error(
        "Erreur de suppression du groupe :",
        error
      );

      setErreur(
        extraireErreur(
          error,
          "Impossible de supprimer ce groupe. Il est peut-être encore utilisé par des utilisateurs."
        )
      );
    } finally {
      setSuppressionEnCours(null);
    }
  };

  // ==========================================
  // RECHERCHE
  // ==========================================

  const groupesFiltres = groupes.filter((groupe) => {
    const texte = recherche.toLowerCase();

    return [
      groupe.group_name,
      groupe.group_desc
    ]
      .filter(Boolean)
      .some((valeur) =>
        String(valeur).toLowerCase().includes(texte)
      );
  });

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <div className="page-groupes">
      <div className="page-header mb-4">
        <h3 className="page-title">
          Gestion des groupes
        </h3>

        <p className="text-muted">
          Organise les utilisateurs en groupes pour faciliter
          la gestion de leurs droits dans SABA.
        </p>
      </div>

      {erreur && !showModal && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setErreur("")}
        >
          {erreur}
        </Alert>
      )}

      {message && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col md={6}>
              <h4 className="card-title mb-0">
                Liste des groupes
                <Badge variant="info" className="ml-2">
                  {groupes.length}
                </Badge>
              </h4>
            </Col>

            <Col md={6} className="mt-3 mt-md-0">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un groupe..."
                  value={recherche}
                  onChange={(event) =>
                    setRecherche(event.target.value)
                  }
                />

                <Button
                  variant="primary"
                  onClick={ouvrirCreation}
                >
                  <i className="mdi mdi-account-multiple-plus mr-1" />
                  Nouveau groupe
                </Button>
              </InputGroup>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">
                Chargement des groupes...
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover bordered>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nom du groupe</th>
                    <th>Description</th>
                    <th>Date de création</th>
                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {groupesFiltres.length > 0 ? (
                    groupesFiltres.map((groupe, index) => (
                      <tr key={groupe.id}>
                        <td>{index + 1}</td>

                        <td>
                          <strong>
                            {groupe.group_name}
                          </strong>
                        </td>

                        <td>
                          {groupe.group_desc || "Aucune description"}
                        </td>

                        <td>
                          {groupe.date_created
                            ? new Date(
                                groupe.date_created
                              ).toLocaleDateString("fr-FR")
                            : "—"}
                        </td>

                        <td className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="mr-2"
                            title="Modifier"
                            disabled={
                              suppressionEnCours === groupe.id
                            }
                            onClick={() =>
                              ouvrirModification(groupe)
                            }
                          >
                            <i className="mdi mdi-pencil" />
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Supprimer"
                            disabled={
                              suppressionEnCours === groupe.id
                            }
                            onClick={() =>
                              supprimerGroupe(groupe)
                            }
                          >
                            {suppressionEnCours === groupe.id ? (
                              <Spinner
                                animation="border"
                                size="sm"
                              />
                            ) : (
                              <i className="mdi mdi-delete" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4"
                      >
                        Aucun groupe trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* MODALE DE CRÉATION / MODIFICATION */}

      <Modal
        show={showModal}
        onHide={fermerModal}
        centered
        backdrop={saving ? "static" : true}
        keyboard={!saving}
      >
        <Form onSubmit={enregistrerGroupe}>
          <Modal.Header closeButton={!saving}>
            <Modal.Title>
              {modeModification
                ? "Modifier le groupe"
                : "Créer un groupe"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {erreur && (
              <Alert variant="danger">
                {erreur}
              </Alert>
            )}

            <Form.Group>
              <Form.Label>
                Nom du groupe{" "}
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Control
                type="text"
                name="group_name"
                value={formData.group_name}
                onChange={handleChange}
                required
                maxLength={300}
                placeholder="Ex. Comptabilité"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Description
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={4}
                name="group_desc"
                value={formData.group_desc}
                onChange={handleChange}
                placeholder="Décris le rôle de ce groupe..."
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="light"
              onClick={fermerModal}
              disabled={saving}
            >
              Annuler
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="mr-2"
                  />
                  Enregistrement...
                </>
              ) : modeModification ? (
                "Enregistrer les modifications"
              ) : (
                "Créer le groupe"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Groupes;