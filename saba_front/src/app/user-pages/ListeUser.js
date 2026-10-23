// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import AxiosInstance from "../Axios";

// function ListeUser() {

//     const [utilisateurs, setUtilisateurs] = useState([]);
//     const [chargement, setChargement] = useState(true);
//     const [erreur, setErreur] = useState("");

//     // ==========================================
//     // CHARGEMENT DES UTILISATEURS
//     // ==========================================

//     useEffect(() => {
//         chargerUtilisateurs();
//     }, []);

//     const chargerUtilisateurs = () => {

//         setChargement(true);
//         setErreur("");

//         AxiosInstance.get("users/")
//             .then((res) => {

//                 // Compatible avec une liste simple ou paginée
//                 const donnees = Array.isArray(res.data)
//                     ? res.data
//                     : res.data.results || [];

//                 setUtilisateurs(donnees);

//             })
//             .catch((err) => {

//                 console.error(
//                     "Erreur lors du chargement des utilisateurs :",
//                     err
//                 );

//                 if (err.response?.status === 401) {
//                     setErreur(
//                         "Vous devez vous connecter pour consulter les utilisateurs."
//                     );
//                 } else if (err.response?.status === 403) {
//                     setErreur(
//                         "Accès refusé. Seuls les administrateurs peuvent gérer les utilisateurs."
//                     );
//                 } else {
//                     setErreur(
//                         "Impossible de charger les utilisateurs. Vérifiez la connexion au serveur."
//                     );
//                 }

//             })
//             .finally(() => {
//                 setChargement(false);
//             });
//     };

//     // ==========================================
//     // AFFICHAGE DU ROLE
//     // ==========================================

//     const afficherRole = (role) => {

//         if (role === "Administrateur") {
//             return (
//                 <span className="badge badge-danger">
//                     Administrateur
//                 </span>
//             );
//         }

//         return (
//             <span className="badge badge-info">
//                 Utilisateur
//             </span>
//         );
//     };

//     // ==========================================
//     // AFFICHAGE DU STATUT
//     // ==========================================

//     const afficherStatut = (actif) => {

//         if (actif) {
//             return (
//                 <span className="badge badge-success">
//                     Actif
//                 </span>
//             );
//         }

//         return (
//             <span className="badge badge-secondary">
//                 Désactivé
//             </span>
//         );
//     };

//     // ==========================================
//     // AFFICHAGE DE LA PAGE
//     // ==========================================

//     return (
//         <div>

//             {/* EN-TÊTE */}

//             <div className="page-header">

//                 <h3 className="page-title">
//                     Gestion des utilisateurs
//                 </h3>

//                 <nav>
//                     <Link
//                         to="/user-pages/formulaire-user"
//                         className="btn btn-success"
//                     >
//                         <i className="mdi mdi-account-plus mr-1"></i>
//                         Nouvel utilisateur
//                     </Link>
//                 </nav>

//             </div>

//             {/* CARTE PRINCIPALE */}

//             <div className="card shadow">

//                 <div className="card-body">

//                     <div className="d-flex justify-content-between align-items-center mb-4">

//                         <h4 className="card-title mb-0">
//                             Utilisateurs enregistrés
//                         </h4>

//                         <button
//                             type="button"
//                             className="btn btn-outline-primary btn-sm"
//                             onClick={chargerUtilisateurs}
//                             disabled={chargement}
//                         >
//                             <i className="mdi mdi-refresh mr-1"></i>
//                             Actualiser
//                         </button>

//                     </div>

//                     {/* MESSAGE D'ERREUR */}

//                     {erreur && (
//                         <div className="alert alert-danger">
//                             {erreur}
//                         </div>
//                     )}

//                     {/* TABLEAU */}

//                     <div className="table-responsive">

//                         <table className="table table-hover table-striped">

//                             <thead className="thead-dark">

//                                 <tr>
//                                     <th width="50">N°</th>
//                                     <th>Nom d'utilisateur</th>
//                                     <th>Nom</th>
//                                     <th>Prénom</th>
//                                     <th>Email</th>
//                                     <th>Rôle</th>
//                                     <th>Statut</th>
//                                 </tr>

//                             </thead>

//                             <tbody>

//                                 {chargement ? (

//                                     <tr>
//                                         <td colSpan="7" className="text-center">
//                                             Chargement des utilisateurs...
//                                         </td>
//                                     </tr>

//                                 ) : erreur ? (

//                                     <tr>
//                                         <td colSpan="7" className="text-center">
//                                             Les utilisateurs ne peuvent pas être affichés.
//                                         </td>
//                                     </tr>

//                                 ) : utilisateurs.length === 0 ? (

//                                     <tr>
//                                         <td colSpan="7" className="text-center">
//                                             Aucun utilisateur disponible.
//                                         </td>
//                                     </tr>

//                                 ) : (

//                                     utilisateurs.map((utilisateur, index) => (

//                                         <tr key={utilisateur.id}>

//                                             <td>{index + 1}</td>

//                                             <td>
//                                                 <strong>
//                                                     {utilisateur.username}
//                                                 </strong>
//                                             </td>

//                                             <td>
//                                                 {utilisateur.last_name || "-"}
//                                             </td>

//                                             <td>
//                                                 {utilisateur.first_name || "-"}
//                                             </td>

//                                             <td>
//                                                 {utilisateur.email || "-"}
//                                             </td>

//                                             <td>
//                                                 {afficherRole(utilisateur.role)}
//                                             </td>

//                                             <td>
//                                                 {afficherStatut(
//                                                     utilisateur.is_active
//                                                 )}
//                                             </td>

//                                         </tr>

//                                     ))

//                                 )}

//                             </tbody>

//                         </table>

//                     </div>

//                     {/* PIED DE PAGE */}

//                     {!chargement && !erreur && (
//                         <div className="mt-3 text-muted">
//                             Nombre total d'utilisateurs :{" "}
//                             <strong>{utilisateurs.length}</strong>
//                         </div>
//                     )}

//                 </div>

//             </div>

//         </div>
//     );
// }

// export default ListeUser;



import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../Axios";

function ListeUser() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState("");
    const [recherche, setRecherche] = useState("");
    const [actionEnCours, setActionEnCours] = useState(null);
    const [messageSucces, setMessageSucces] = useState("");

    // ==========================================
    // CHARGEMENT DES UTILISATEURS
    // ==========================================

    const chargerUtilisateurs = async () => {
        setChargement(true);
        setErreur("");

        try {
            const res = await AxiosInstance.get("users/");

            const donnees = Array.isArray(res.data)
                ? res.data
                : res.data.results || [];

            setUtilisateurs(donnees);
        } catch (err) {
            console.error("Erreur de chargement :", err);

            if (err.response?.status === 401) {
                setErreur(
                    "Vous devez vous connecter pour consulter les utilisateurs."
                );
            } else if (err.response?.status === 403) {
                setErreur(
                    "Accès refusé. Seuls les administrateurs peuvent gérer les utilisateurs."
                );
            } else {
                setErreur(
                    "Impossible de charger les utilisateurs. Vérifiez le serveur Django."
                );
            }
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerUtilisateurs();
    }, []);

    // ==========================================
    // RECHERCHE
    // ==========================================

    const utilisateursFiltres = useMemo(() => {
        const terme = recherche.trim().toLowerCase();

        if (!terme) {
            return utilisateurs;
        }

        return utilisateurs.filter((utilisateur) => {
            const texte = [
                utilisateur.username,
                utilisateur.first_name,
                utilisateur.last_name,
                utilisateur.email,
                utilisateur.role,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return texte.includes(terme);
        });
    }, [utilisateurs, recherche]);

    // ==========================================
    // AFFICHAGE DU ROLE
    // ==========================================

    const afficherRole = (role) => {
        if (role === "Administrateur") {
            return (
                <span className="badge badge-danger">
                    Administrateur
                </span>
            );
        }

        return (
            <span className="badge badge-info">
                Utilisateur
            </span>
        );
    };

    // ==========================================
    // AFFICHAGE DU STATUT
    // ==========================================

    const afficherStatut = (actif) => {
        return actif ? (
            <span className="badge badge-success">Actif</span>
        ) : (
            <span className="badge badge-secondary">Désactivé</span>
        );
    };

    // ==========================================
    // ACTIVER / DESACTIVER UN COMPTE
    // ==========================================

    const changerStatut = async (utilisateur) => {
        const nouveauStatut = !utilisateur.is_active;

        const confirmation = window.confirm(
            `Voulez-vous vraiment ${
                nouveauStatut ? "activer" : "désactiver"
            } le compte "${utilisateur.username}" ?`
        );

        if (!confirmation) {
            return;
        }

        setActionEnCours(utilisateur.id);
        setErreur("");
        setMessageSucces("");

        try {
            await AxiosInstance.patch(`users/${utilisateur.id}/`, {
                is_active: nouveauStatut,
            });

            setUtilisateurs((precedents) =>
                precedents.map((u) =>
                    u.id === utilisateur.id
                        ? { ...u, is_active: nouveauStatut }
                        : u
                )
            );

            setMessageSucces(
                `Le compte "${utilisateur.username}" a été ${
                    nouveauStatut ? "activé" : "désactivé"
                } avec succès.`
            );
        } catch (err) {
            console.error("Erreur de changement de statut :", err);

            setErreur(
                err.response?.status === 403
                    ? "Vous n'avez pas l'autorisation de modifier ce compte."
                    : "Impossible de modifier le statut du compte."
            );
        } finally {
            setActionEnCours(null);
        }
    };

    // ==========================================
    // SUPPRIMER UN UTILISATEUR
    // ==========================================

    const supprimerUtilisateur = async (utilisateur) => {
        const confirmation = window.confirm(
            `Attention ! Voulez-vous vraiment supprimer le compte "${utilisateur.username}" ? Cette action est irréversible.`
        );

        if (!confirmation) {
            return;
        }

        setActionEnCours(utilisateur.id);
        setErreur("");
        setMessageSucces("");

        try {
            await AxiosInstance.delete(`users/${utilisateur.id}/`);

            setUtilisateurs((precedents) =>
                precedents.filter((u) => u.id !== utilisateur.id)
            );

            setMessageSucces(
                `Le compte "${utilisateur.username}" a été supprimé.`
            );
        } catch (err) {
            console.error("Erreur de suppression :", err);

            setErreur(
                err.response?.status === 403
                    ? "Vous n'avez pas l'autorisation de supprimer cet utilisateur."
                    : "Impossible de supprimer cet utilisateur."
            );
        } finally {
            setActionEnCours(null);
        }
    };

    // ==========================================
    // AFFICHAGE
    // ==========================================

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    Gestion des utilisateurs
                </h3>

                <nav>
                    <Link
                        to="/user-pages/formulaire-user"
                        className="btn btn-success"
                    >
                        <i className="mdi mdi-account-plus mr-1"></i>
                        Nouvel utilisateur
                    </Link>
                </nav>
            </div>

            <div className="card shadow">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                        <h4 className="card-title mb-2">
                            Utilisateurs enregistrés
                        </h4>

                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={chargerUtilisateurs}
                            disabled={chargement || actionEnCours !== null}
                        >
                            <i className="mdi mdi-refresh mr-1"></i>
                            Actualiser
                        </button>
                    </div>

                    {erreur && (
                        <div className="alert alert-danger" role="alert">
                            {erreur}
                        </div>
                    )}

                    {messageSucces && (
                        <div className="alert alert-success" role="status">
                            {messageSucces}
                        </div>
                    )}

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <i className="mdi mdi-magnify"></i>
                                    </span>
                                </div>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Rechercher un utilisateur..."
                                    value={recherche}
                                    onChange={(event) =>
                                        setRecherche(event.target.value)
                                    }
                                    aria-label="Rechercher un utilisateur"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>N°</th>
                                    <th>Identifiant</th>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>E-mail</th>
                                    <th>Rôle</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {chargement ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            <span
                                                className="spinner-border spinner-border-sm mr-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Chargement des utilisateurs...
                                        </td>
                                    </tr>
                                ) : erreur && utilisateurs.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            Les utilisateurs ne peuvent pas être affichés.
                                        </td>
                                    </tr>
                                ) : utilisateursFiltres.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            {recherche
                                                ? "Aucun résultat pour cette recherche."
                                                : "Aucun utilisateur disponible."}
                                        </td>
                                    </tr>
                                ) : (
                                    utilisateursFiltres.map((utilisateur, index) => (
                                        <tr key={utilisateur.id}>
                                            <td>{index + 1}</td>

                                            <td>
                                                <strong>
                                                    {utilisateur.username}
                                                </strong>
                                            </td>

                                            <td>
                                                {utilisateur.last_name || "-"}
                                            </td>

                                            <td>
                                                {utilisateur.first_name || "-"}
                                            </td>

                                            <td>
                                                {utilisateur.email || "-"}
                                            </td>

                                            <td>
                                                {afficherRole(utilisateur.role)}
                                            </td>

                                            <td>
                                                {afficherStatut(
                                                    utilisateur.is_active
                                                )}
                                            </td>

                                            <td>
                                                <div className="d-flex">
                                                    <Link
                                                        to={`/user-pages/modifier-user/${utilisateur.id}`}
                                                        className="btn btn-warning btn-sm mr-1"
                                                        title="Modifier"
                                                        aria-label={`Modifier ${utilisateur.username}`}
                                                    >
                                                        <i className="mdi mdi-pencil"></i>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm mr-1 ${
                                                            utilisateur.is_active
                                                                ? "btn-secondary"
                                                                : "btn-success"
                                                        }`}
                                                        onClick={() =>
                                                            changerStatut(utilisateur)
                                                        }
                                                        disabled={
                                                            actionEnCours !== null
                                                        }
                                                        title={
                                                            utilisateur.is_active
                                                                ? "Désactiver"
                                                                : "Activer"
                                                        }
                                                        aria-label={`${
                                                            utilisateur.is_active
                                                                ? "Désactiver"
                                                                : "Activer"
                                                        } ${utilisateur.username}`}
                                                    >
                                                        <i
                                                            className={`mdi ${
                                                                utilisateur.is_active
                                                                    ? "mdi-account-off"
                                                                    : "mdi-account-check"
                                                            }`}
                                                        ></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            supprimerUtilisateur(utilisateur)
                                                        }
                                                        disabled={
                                                            actionEnCours !== null
                                                        }
                                                        title="Supprimer"
                                                        aria-label={`Supprimer ${utilisateur.username}`}
                                                    >
                                                        <i className="mdi mdi-delete"></i>
                                                    </button>
                                                </div>

                                                {actionEnCours === utilisateur.id && (
                                                    <small className="text-muted d-block mt-1">
                                                        Traitement...
                                                    </small>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!chargement && !erreur && (
                        <div className="mt-3 text-muted">
                            Résultats affichés :{" "}
                            <strong>{utilisateursFiltres.length}</strong>
                            {" / "}
                            <strong>{utilisateurs.length}</strong>
                            {" utilisateur(s)"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListeUser;

