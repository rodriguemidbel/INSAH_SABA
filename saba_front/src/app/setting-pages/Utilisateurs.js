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

function Utilisateurs() {
  // ==========================================
  // ÉTATS
  // ==========================================

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [groupes, setGroupes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionEnCours, setActionEnCours] = useState(null);

  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [recherche, setRecherche] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modeModification, setModeModification] = useState(false);
  const [utilisateurId, setUtilisateurId] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    is_active: true,
    title: "",
    pays: "",
    phone: "",
    address: "",
    job: "",
    departement: "",
    usergroup: ""
  });

  // ==========================================
  // GESTION DES ERREURS API
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
  // CHARGEMENT DES DONNÉES
  // ==========================================

  const chargerDonnees = async () => {
    setLoading(true);
    setErreur("");

    try {
      const [utilisateursResponse, groupesResponse] =
        await Promise.all([
          AxiosInstance.get("/users/"),
          AxiosInstance.get("/usergroups/")
        ]);

      const donneesUtilisateurs = utilisateursResponse.data;
      const donneesGroupes = groupesResponse.data;

      setUtilisateurs(
        Array.isArray(donneesUtilisateurs)
          ? donneesUtilisateurs
          : donneesUtilisateurs.results || []
      );

      setGroupes(
        Array.isArray(donneesGroupes)
          ? donneesGroupes
          : donneesGroupes.results || []
      );
    } catch (error) {
      console.error(
        "Erreur de chargement des utilisateurs :",
        error
      );

      setErreur(
        extraireErreur(
          error,
          "Impossible de charger les utilisateurs. Vérifie que tu es connecté avec un compte administrateur."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  // ==========================================
  // FORMULAIRE
  // ==========================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const formulaireInitial = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    is_active: true,
    title: "",
    pays: "",
    phone: "",
    address: "",
    job: "",
    departement: "",
    usergroup: ""
  };

  const ouvrirCreation = () => {
    setModeModification(false);
    setUtilisateurId(null);
    setFormData({ ...formulaireInitial });
    setErreur("");
    setMessage("");
    setShowModal(true);
  };

  const ouvrirModification = (utilisateur) => {
    setModeModification(true);
    setUtilisateurId(utilisateur.id);

    setFormData({
      username: utilisateur.username || "",
      first_name: utilisateur.first_name || "",
      last_name: utilisateur.last_name || "",
      email: utilisateur.email || "",
      password: "",
      is_active: utilisateur.is_active,
      title: utilisateur.title || "",
      pays: utilisateur.pays || "",
      phone: utilisateur.phone || "",
      address: utilisateur.address || "",
      job: utilisateur.job || "",
      departement: utilisateur.departement || "",
      usergroup: utilisateur.usergroup ?? ""
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

  const enregistrerUtilisateur = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");

    if (!formData.username.trim()) {
      setErreur("Le nom d'utilisateur est obligatoire.");
      return;
    }

    if (!modeModification && !formData.password) {
      setErreur("Le mot de passe est obligatoire.");
      return;
    }

    if (!modeModification && formData.password.length < 8) {
      setErreur(
        "Choisis un mot de passe d'au moins 8 caractères."
      );
      return;
    }

    const donnees = {
      username: formData.username.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      is_active: formData.is_active,
      title: formData.title,
      pays: formData.pays,
      phone: formData.phone,
      address: formData.address,
      job: formData.job,
      departement: formData.departement,
      usergroup: formData.usergroup
        ? Number(formData.usergroup)
        : null
    };

    if (formData.password) {
      donnees.password = formData.password;
    }

    setSaving(true);

    try {
      if (modeModification) {
        await AxiosInstance.patch(
          `/users/${utilisateurId}/`,
          donnees
        );

        setMessage(
          "L'utilisateur a été modifié avec succès."
        );
      } else {
        await AxiosInstance.post("/users/", donnees);

        setMessage(
          "L'utilisateur a été créé avec succès."
        );
      }

      setShowModal(false);
      await chargerDonnees();

      setMessage(
        modeModification
          ? "L'utilisateur a été modifié avec succès."
          : "L'utilisateur a été créé avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur d'enregistrement de l'utilisateur :",
        error
      );

      setErreur(
        extraireErreur(
          error,
          "Impossible d'enregistrer cet utilisateur."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // ACTIVATION / DÉSACTIVATION
  // ==========================================

  const changerStatut = async (utilisateur) => {
    const nouvelEtat = !utilisateur.is_active;

    const confirmation = window.confirm(
      nouvelEtat
        ? `Voulez-vous réactiver le compte "${utilisateur.username}" ?`
        : `Voulez-vous désactiver le compte "${utilisateur.username}" ?`
    );

    if (!confirmation) return;

    setErreur("");
    setMessage("");
    setActionEnCours(utilisateur.id);

    try {
      await AxiosInstance.patch(
        `/users/${utilisateur.id}/`,
        {
          is_active: nouvelEtat
        }
      );

      setUtilisateurs((previous) =>
        previous.map((item) =>
          item.id === utilisateur.id
            ? { ...item, is_active: nouvelEtat }
            : item
        )
      );

      setMessage(
        nouvelEtat
          ? "Le compte a été réactivé."
          : "Le compte a été désactivé."
      );
    } catch (error) {
      console.error(
        "Erreur de modification du statut :",
        error
      );

      setErreur(
        extraireErreur(
          error,
          "Impossible de modifier le statut du compte."
        )
      );
    } finally {
      setActionEnCours(null);
    }
  };

  // ==========================================
  // SUPPRESSION
  // ==========================================

  const supprimerUtilisateur = async (utilisateur) => {
    let utilisateurConnecte = null;

    try {
      utilisateurConnecte = JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.error(
        "Impossible de lire l'utilisateur connecté :",
        error
      );
    }

    if (
      utilisateurConnecte &&
      Number(utilisateurConnecte.id) === Number(utilisateur.id)
    ) {
      setErreur(
        "Tu ne peux pas supprimer ton propre compte depuis cette page."
      );
      return;
    }

    const confirmation = window.confirm(
      `Attention : cette action supprimera le compte "${utilisateur.username}". Voulez-vous continuer ?`
    );

    if (!confirmation) return;

    setErreur("");
    setMessage("");
    setActionEnCours(utilisateur.id);

    try {
      await AxiosInstance.delete(
        `/users/${utilisateur.id}/`
      );

      setUtilisateurs((previous) =>
        previous.filter(
          (item) => item.id !== utilisateur.id
        )
      );

      setMessage(
        `Le compte "${utilisateur.username}" a été supprimé.`
      );
    } catch (error) {
      console.error(
        "Erreur de suppression de l'utilisateur :",
        error
      );

      setErreur(
        extraireErreur(
          error,
          "Impossible de supprimer ce compte."
        )
      );
    } finally {
      setActionEnCours(null);
    }
  };

  // ==========================================
  // RECHERCHE
  // ==========================================

  const utilisateursFiltres = utilisateurs.filter(
    (utilisateur) => {
      const texte = recherche.toLowerCase();

      const groupe = groupes.find(
        (item) =>
          Number(item.id) === Number(utilisateur.usergroup)
      );

      const valeurs = [
        utilisateur.username,
        utilisateur.first_name,
        utilisateur.last_name,
        utilisateur.email,
        utilisateur.phone,
        utilisateur.departement,
        utilisateur.role,
        groupe?.group_name
      ];

      return valeurs
        .filter(Boolean)
        .some((valeur) =>
          String(valeur).toLowerCase().includes(texte)
        );
    }
  );

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <div className="page-utilisateurs">
      <div className="page-header mb-4">
        <h3 className="page-title">
          Gestion des utilisateurs
        </h3>

        <p className="text-muted">
          Crée et gère les comptes utilisateurs de l'application SABA.
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
                Liste des comptes
              </h4>
            </Col>

            <Col md={6} className="mt-3 mt-md-0">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un utilisateur..."
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
                  Nouvel utilisateur
                </Button>
              </InputGroup>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">
                Chargement des utilisateurs...
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover bordered>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nom d'utilisateur</th>
                    <th>Nom complet</th>
                    <th>Email</th>
                    <th>Groupe</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {utilisateursFiltres.length > 0 ? (
                    utilisateursFiltres.map(
                      (utilisateur, index) => {
                        const groupe = groupes.find(
                          (item) =>
                            Number(item.id) ===
                            Number(utilisateur.usergroup)
                        );

                        return (
                          <tr key={utilisateur.id}>
                            <td>{index + 1}</td>

                            <td>
                              {utilisateur.username}
                            </td>

                            <td>
                              {[
                                utilisateur.first_name,
                                utilisateur.last_name
                              ]
                                .filter(Boolean)
                                .join(" ") || "—"}
                            </td>

                            <td>
                              {utilisateur.email || "—"}
                            </td>

                            <td>
                              {groupe?.group_name || "—"}
                            </td>

                            <td>
                              <Badge
                                variant={
                                  utilisateur.role ===
                                  "Administrateur"
                                    ? "primary"
                                    : "secondary"
                                }
                              >
                                {utilisateur.role ||
                                  "Utilisateur"}
                              </Badge>
                            </td>

                            <td>
                              <Badge
                                variant={
                                  utilisateur.is_active
                                    ? "success"
                                    : "danger"
                                }
                              >
                                {utilisateur.is_active
                                  ? "Actif"
                                  : "Inactif"}
                              </Badge>
                            </td>

                            <td className="text-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="mr-1 mb-1"
                                title="Modifier"
                                disabled={
                                  actionEnCours ===
                                  utilisateur.id
                                }
                                onClick={() =>
                                  ouvrirModification(
                                    utilisateur
                                  )
                                }
                              >
                                <i className="mdi mdi-pencil" />
                              </Button>

                              <Button
                                variant={
                                  utilisateur.is_active
                                    ? "outline-warning"
                                    : "outline-success"
                                }
                                size="sm"
                                className="mr-1 mb-1"
                                title={
                                  utilisateur.is_active
                                    ? "Désactiver"
                                    : "Réactiver"
                                }
                                disabled={
                                  actionEnCours ===
                                  utilisateur.id
                                }
                                onClick={() =>
                                  changerStatut(utilisateur)
                                }
                              >
                                <i
                                  className={
                                    utilisateur.is_active
                                      ? "mdi mdi-account-off"
                                      : "mdi mdi-account-check"
                                  }
                                />
                              </Button>

                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="mb-1"
                                title="Supprimer"
                                disabled={
                                  actionEnCours ===
                                  utilisateur.id
                                }
                                onClick={() =>
                                  supprimerUtilisateur(
                                    utilisateur
                                  )
                                }
                              >
                                {actionEnCours ===
                                utilisateur.id ? (
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
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4"
                      >
                        Aucun utilisateur trouvé.
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
        <Form onSubmit={enregistrerUtilisateur}>
          <Modal.Header closeButton={!saving}>
            <Modal.Title>
              {modeModification
                ? "Modifier un utilisateur"
                : "Créer un utilisateur"}
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
                    Nom d'utilisateur{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    placeholder="Nom d'utilisateur"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Email
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="adresse@example.com"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Prénom</Form.Label>

                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Prénom"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nom</Form.Label>

                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Nom de famille"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>
                    Mot de passe{" "}
                    {!modeModification && (
                      <span className="text-danger">*</span>
                    )}
                  </Form.Label>

                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!modeModification}
                    autoComplete={
                      modeModification
                        ? "new-password"
                        : "new-password"
                    }
                    placeholder={
                      modeModification
                        ? "Laisser vide pour conserver le mot de passe actuel"
                        : "Créer un mot de passe"
                    }
                  />

                  {modeModification && (
                    <Form.Text className="text-muted">
                      Laisse ce champ vide si tu ne souhaites
                      pas modifier le mot de passe.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Groupe SABA
                  </Form.Label>

                  <Form.Control
                    as="select"
                    name="usergroup"
                    value={formData.usergroup}
                    onChange={handleChange}
                  >
                    <option value="">
                      Aucun groupe
                    </option>

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
                    placeholder="Téléphone"
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

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Adresse</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Adresse"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    label="Compte actif"
                  />

                  <Form.Text className="text-muted">
                    Un compte désactivé ne peut normalement
                    plus se connecter à l'application.
                  </Form.Text>
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
                "Créer le compte"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Utilisateurs;