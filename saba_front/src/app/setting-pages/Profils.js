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
  InputGroup
} from "react-bootstrap";

import AxiosInstance from "../Axios";

function Profils() {
  // ==========================================
  // ÉTATS
  // ==========================================

  const [profils, setProfils] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [groupes, setGroupes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [recherche, setRecherche] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modeModification, setModeModification] = useState(false);
  const [profilId, setProfilId] = useState(null);

  const [formData, setFormData] = useState({
    user: "",
    title: "",
    pays: "",
    phone: "",
    address: "",
    job: "",
    departement: "",
    usergroup: "",
    status: ""
  });

  // ==========================================
  // CHARGEMENT DES DONNÉES
  // ==========================================

  const chargerDonnees = async () => {
    setLoading(true);
    setErreur("");

    try {
      const [profilsResponse, utilisateursResponse, groupesResponse] =
        await Promise.all([
          AxiosInstance.get("/user-profiles/"),
          AxiosInstance.get("/users/"),
          AxiosInstance.get("/usergroups/")
        ]);

      setProfils(
        Array.isArray(profilsResponse.data)
          ? profilsResponse.data
          : profilsResponse.data.results || []
      );

      setUtilisateurs(
        Array.isArray(utilisateursResponse.data)
          ? utilisateursResponse.data
          : utilisateursResponse.data.results || []
      );

      setGroupes(
        Array.isArray(groupesResponse.data)
          ? groupesResponse.data
          : groupesResponse.data.results || []
      );
    } catch (error) {
      console.error("Erreur de chargement des profils :", error);

      setErreur(
        error.response?.data?.detail ||
          "Impossible de charger les profils. Vérifie que tu es connecté avec un compte administrateur."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  // ==========================================
  // GESTION DU FORMULAIRE
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
    setProfilId(null);

    setFormData({
      user: "",
      title: "",
      pays: "",
      phone: "",
      address: "",
      job: "",
      departement: "",
      usergroup: "",
      status: ""
    });

    setErreur("");
    setMessage("");
    setShowModal(true);
  };

  const ouvrirModification = (profil) => {
    setModeModification(true);
    setProfilId(profil.id);

    setFormData({
      user: profil.user ?? "",
      title: profil.title ?? "",
      pays: profil.pays ?? "",
      phone: profil.phone ?? "",
      address: profil.address ?? "",
      job: profil.job ?? "",
      departement: profil.departement ?? "",
      usergroup: profil.usergroup ?? "",
      status: profil.status ?? ""
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
  // ENREGISTREMENT
  // ==========================================

  const enregistrerProfil = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");

    if (!formData.user) {
      setErreur("Veuillez sélectionner un utilisateur.");
      return;
    }

    const donnees = {
      user: Number(formData.user),
      title: formData.title,
      pays: formData.pays,
      phone: formData.phone,
      address: formData.address,
      job: formData.job,
      departement: formData.departement,
      usergroup: formData.usergroup
        ? Number(formData.usergroup)
        : null,
      status: formData.status
    };

    setSaving(true);

    try {
      if (modeModification) {
        await AxiosInstance.patch(
          `/user-profiles/${profilId}/`,
          donnees
        );

        setMessage("Le profil a été modifié avec succès.");
      } else {
        await AxiosInstance.post("/user-profiles/", donnees);

        setMessage("Le profil a été créé avec succès.");
      }

      setShowModal(false);
      await chargerDonnees();
      setMessage(
        modeModification
          ? "Le profil a été modifié avec succès."
          : "Le profil a été créé avec succès."
      );
    } catch (error) {
      console.error("Erreur d'enregistrement :", error);

      const details = error.response?.data;

      if (details && typeof details === "object") {
        const messages = Object.entries(details)
          .map(([champ, valeur]) => {
            const texte = Array.isArray(valeur)
              ? valeur.join(" ")
              : typeof valeur === "string"
                ? valeur
                : JSON.stringify(valeur);

            return `${champ} : ${texte}`;
          })
          .join(" | ");

        setErreur(
          messages || "Impossible d'enregistrer le profil."
        );
      } else {
        setErreur("Impossible d'enregistrer le profil.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // SUPPRESSION
  // ==========================================

  const supprimerProfil = async (profil) => {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer le profil de ${
        profil.username || profil.email || "cet utilisateur"
      } ?`
    );

    if (!confirmation) return;

    setErreur("");
    setMessage("");

    try {
      await AxiosInstance.delete(`/user-profiles/${profil.id}/`);

      setProfils((previous) =>
        previous.filter((item) => item.id !== profil.id)
      );

      setMessage("Le profil a été supprimé avec succès.");
    } catch (error) {
      console.error("Erreur de suppression :", error);

      setErreur(
        error.response?.data?.detail ||
          "Impossible de supprimer ce profil."
      );
    }
  };

  // ==========================================
  // RECHERCHE
  // ==========================================

  const profilsFiltres = profils.filter((profil) => {
    const texte = recherche.toLowerCase();

    return [
      profil.username,
      profil.email,
      profil.first_name,
      profil.last_name,
      profil.phone,
      profil.departement,
      profil.usergroup_name
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
    <div className="page-profil">
      <div className="page-header mb-4">
        <h3 className="page-title">Gestion des profils</h3>

        <p className="text-muted">
          Consulte et gère les informations professionnelles des utilisateurs.
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
            <Col md={7}>
              <h4 className="card-title mb-0">
                Liste des profils
              </h4>
            </Col>

            <Col md={5} className="mt-3 mt-md-0">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un profil..."
                  value={recherche}
                  onChange={(event) =>
                    setRecherche(event.target.value)
                  }
                />

                <Button
                  variant="primary"
                  onClick={ouvrirCreation}
                >
                  <i className="mdi mdi-account-plus mr-1" />
                  Nouveau profil
                </Button>
              </InputGroup>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Chargement des profils...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover bordered>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Département</th>
                    <th>Groupe</th>
                    <th>Statut</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {profilsFiltres.length > 0 ? (
                    profilsFiltres.map((profil, index) => (
                      <tr key={profil.id}>
                        <td>{index + 1}</td>

                        <td>
                          {[
                            profil.first_name,
                            profil.last_name
                          ]
                            .filter(Boolean)
                            .join(" ") ||
                            profil.username ||
                            "Non renseigné"}
                        </td>

                        <td>{profil.email || "—"}</td>

                        <td>{profil.phone || "—"}</td>

                        <td>{profil.departement || "—"}</td>

                        <td>{profil.usergroup_name || "—"}</td>

                        <td>
                          {profil.status || "Non renseigné"}
                        </td>

                        <td className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="mr-2"
                            title="Modifier"
                            onClick={() =>
                              ouvrirModification(profil)
                            }
                          >
                            <i className="mdi mdi-pencil" />
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Supprimer"
                            onClick={() =>
                              supprimerProfil(profil)
                            }
                          >
                            <i className="mdi mdi-delete" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4"
                      >
                        Aucun profil trouvé.
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
        size="lg"
        centered
        backdrop={saving ? "static" : true}
        keyboard={!saving}
      >
        <Form onSubmit={enregistrerProfil}>
          <Modal.Header closeButton={!saving}>
            <Modal.Title>
              {modeModification
                ? "Modifier le profil"
                : "Créer un profil"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {erreur && (
              <Alert variant="danger">
                {erreur}
              </Alert>
            )}

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Utilisateur <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Control
                    as="select"
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    required
                    disabled={modeModification}
                  >
                    <option value="">
                      Sélectionner un utilisateur
                    </option>

                    {/* {utilisateurs.map((utilisateur) => (
                      <option
                        key={utilisateur.id}
                        value={utilisateur.id}
                      >
                        {utilisateur.username}
                        {utilisateur.email
                          ? ` — ${utilisateur.email}`
                          : ""}
                      </option>
                    ))} */}

                    {utilisateurs
                    .filter(
                        (utilisateur) =>
                        !profils.some(
                            (profil) =>
                            Number(profil.user) === Number(utilisateur.id)
                        )
                    )
                    .map((utilisateur) => (
                        <option
                        key={utilisateur.id}
                        value={utilisateur.id}
                        >
                        {utilisateur.username}
                        {utilisateur.email
                            ? ` — ${utilisateur.email}`
                            : ""}
                        </option>
                    ))}

                  </Form.Control>

                  {modeModification && (
                    <Form.Text className="text-muted">
                      Le compte associé ne peut pas être changé ici.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Groupe d'utilisateurs</Form.Label>

                  <Form.Control
                    as="select"
                    name="usergroup"
                    value={formData.usergroup}
                    onChange={handleChange}
                  >
                    <option value="">Aucun groupe</option>

                    {groupes.map((groupe) => (
                      <option
                        key={groupe.id}
                        value={groupe.id}
                      >
                        {groupe.group_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Titre</Form.Label>

                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex. M., Mme..."
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pays</Form.Label>

                  <Form.Control
                    type="text"
                    name="pays"
                    value={formData.pays}
                    onChange={handleChange}
                    placeholder="Pays"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Téléphone</Form.Label>

                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Numéro de téléphone"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Département</Form.Label>

                  <Form.Control
                    type="text"
                    name="departement"
                    value={formData.departement}
                    onChange={handleChange}
                    placeholder="Département"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fonction</Form.Label>

                  <Form.Control
                    type="text"
                    name="job"
                    value={formData.job}
                    onChange={handleChange}
                    placeholder="Fonction professionnelle"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Statut</Form.Label>

                  <Form.Control
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    placeholder="Ex. Actif"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Adresse</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Adresse de l'utilisateur"
                  />
                </Form.Group>
              </Col>
            </Row>
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
                "Créer le profil"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Profils;