import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Trans } from 'react-i18next';

const Sidebar = () => {

  const location = useLocation();

  // =========================
  // UTILISATEUR CONNECTÉ
  // =========================
  const utilisateurConnecte = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (error) {
      return null;
    }
  })();

  const estAdministrateur =
    utilisateurConnecte?.role === "Administrateur" ||
    utilisateurConnecte?.is_staff === true ||
    utilisateurConnecte?.is_superuser === true;


  const [menuState, setMenuState] = useState({
    memoPagesMenuOpen: false,
    fournisseurPagesMenuOpen: false,
    bonPagesMenuOpen: false,
    billetPagesMenuOpen: false,
    reservationMenuOpen: false,
    confirmationMenuOpen: false,
    paiementPagesMenuOpen: false,
    factureMenuOpen: false,
    reglementMenuOpen: false,
    settingPagesMenuOpen: false,
    userPagesMenuOpen: false,
  });

  // =========================
  // Toggle Menu
  // =========================
  const toggleMenuState = (menu) => {
    setMenuState((prev) => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // =========================
  // Active Path
  // =========================
  const isPathActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // =========================
  // Open menu on route change
  // =========================
  useEffect(() => {

    const dropdownPaths = [
      { path: '/memo-pages', state: 'memoPagesMenuOpen' },
      { path: '/fournisseur-pages', state: 'fournisseurPagesMenuOpen' },
      { path: '/bon-pages', state: 'bonPagesMenuOpen' },
      { path: '/billet-pages', state: 'billetPagesMenuOpen' },
      { path: '/billet-pages/reservation', state: 'reservationMenuOpen' },
      { path: '/billet-pages/confirmation', state: 'confirmationMenuOpen' },
      { path: '/paiement-pages', state: 'paiementPagesMenuOpen' },
      { path: '/paiement-pages/facture', state: 'factureMenuOpen' },
      { path: '/paiement-pages/reglement', state: 'reglementMenuOpen' },
      { path: '/setting-pages', state: 'settingPagesMenuOpen' },
      { path: '/user-pages', state: 'userPagesMenuOpen' },
    ];

    let newState = {};

    dropdownPaths.forEach((obj) => {
      newState[obj.state] = isPathActive(obj.path);
    });

    setMenuState((prev) => ({
      ...prev,
      ...newState
    }));

  }, [location.pathname]);

  // =========================
  // Generic Sub Menu
  // =========================
  const renderSubMenu = (title, menuName, links) => {
    return (
      <li className="nav-item">

        <div
          className={menuState[menuName] ? 'nav-link menu-expanded' : 'nav-link'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenuState(menuName);
          }}
        >
          <span className="menu-title">{title}</span>
          <i className="menu-arrow"></i>
        </div>

        <Collapse in={menuState[menuName]}>
          <div>
            <ul className="nav flex-column sub-menu">

              {links.map((link, index) => (
                <li className="nav-item" key={index}>
                  <Link
                    className={
                      isPathActive(link.path)
                        ? 'nav-link active'
                        : 'nav-link'
                    }
                    to={link.path}
                  >
                    <Trans>{link.label}</Trans>
                  </Link>
                </li>
              ))}

            </ul>
          </div>
        </Collapse>

      </li>
    );
  };

  return (

    <nav className="sidebar sidebar-offcanvas" id="sidebar">

      {/* Logo */}
      <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">

        <a className="sidebar-brand brand-logo" href="/dashboard">
          <img
            src={require('../../assets/images/logo_cilss_insah.svg')}
            alt="logo"
          />
        </a>

      </div>

      <ul className="nav">

        {/* MENU TITLE */}
        <li className="nav-item nav-category">
          <span className="nav-link">
            <Trans>Menu</Trans>
          </span>
        </li>

        {/* DASHBOARD */}
        <li className={isPathActive('/dashboard') ? 'nav-item menu-items active' : 'nav-item menu-items'}>

          <Link className="nav-link" to="/dashboard">

            <span className="menu-icon">
              <i className="mdi mdi-speedometer"></i>
            </span>

            <span className="menu-title">
              <Trans>Dashboard</Trans>
            </span>

          </Link>

        </li>

        {/* MEMO */}
        <li className={isPathActive('/memo-pages') ? 'nav-item menu-items active' : 'nav-item menu-items'}>

          <div
            className={menuState.memoPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('memoPagesMenuOpen')}
          >

            <span className="menu-icon">
              <i className="mdi mdi-cloud-print"></i>
            </span>

            <span className="menu-title">
              <Trans>Memo</Trans>
            </span>

            <i className="menu-arrow"></i>

          </div>

          <Collapse in={menuState.memoPagesMenuOpen}>

            <div>
              <ul className="nav flex-column sub-menu">

                <li className="nav-item">

                  <Link
                    className={isPathActive('/memo-pages/liste-memo') ? 'nav-link active' : 'nav-link'}
                    to="/memo-pages/liste-memo"
                  >
                    <Trans>Liste Memo</Trans>
                  </Link>

                </li>

                <li className="nav-item">

                  <Link
                    className={isPathActive('/memo-pages/formulaire-memo') ? 'nav-link active' : 'nav-link'}
                    to="/memo-pages/formulaire-memo"
                  >
                    <Trans>Formulaire</Trans>
                  </Link>

                </li>

              </ul>
            </div>

          </Collapse>

        </li>

        {/* FOURNISSEUR */}
        <li className={isPathActive('/fournisseur-pages') ? 'nav-item menu-items active' : 'nav-item menu-items'}>

          <div
            className={menuState.fournisseurPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('fournisseurPagesMenuOpen')}
          >

            <span className="menu-icon">
              <i className="mdi mdi-account-check"></i>
            </span>

            <span className="menu-title">
              <Trans>Fournisseur</Trans>
            </span>

            <i className="menu-arrow"></i>

          </div>

          <Collapse in={menuState.fournisseurPagesMenuOpen}>

            <div>
              <ul className="nav flex-column sub-menu">

                <li className="nav-item">

                  <Link
                    className={isPathActive('/fournisseur-pages/liste-fournisseur') ? 'nav-link active' : 'nav-link'}
                    to="/fournisseur-pages/liste-fournisseur"
                  >
                    <Trans>Liste</Trans>
                  </Link>

                </li>

                {/* <li className="nav-item">

                  <Link
                    className={isPathActive('/fournisseur-pages/formulaire-fournisseur') ? 'nav-link active' : 'nav-link'}
                    to="/fournisseur-pages/formulaire-fournisseur"
                  >
                    <Trans>Formulaire</Trans>
                  </Link>

                </li> */}

              </ul>
            </div>

          </Collapse>

        </li>

        {/* BON DE COMMANDE */}
        <li className={isPathActive('/bon-pages') ? 'nav-item menu-items active' : 'nav-item menu-items'}>

          <div
            className={menuState.bonPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('bonPagesMenuOpen')}
          >

            <span className="menu-icon">
              <i className="mdi mdi-file-document"></i>
            </span>

            <span className="menu-title">
              <Trans>Bon</Trans>
            </span>

            <i className="menu-arrow"></i>

          </div>

          <Collapse in={menuState.bonPagesMenuOpen}>

            <div>
              <ul className="nav flex-column sub-menu">

                <li className="nav-item">

                  <Link
                    className={isPathActive('/bon-pages/liste-bon') ? 'nav-link active' : 'nav-link'}
                    to="/bon-pages/liste-bon"
                  >
                    <Trans>Liste</Trans>
                  </Link>

                </li>

                {/* <li className="nav-item">

                  <Link
                    className={isPathActive('/bon-pages/formulaire-bon') ? 'nav-link active' : 'nav-link'}
                    to="/bon-pages/formulaire-bon"
                  >
                    <Trans>Formulaire</Trans>
                  </Link>

                </li> */}

              </ul>
            </div>

          </Collapse>

        </li>

        {/* BILLET */}
        <li className={isPathActive('/billet-pages') ? 'nav-item menu-items active' : 'nav-item menu-items'}>

          <div
            className={menuState.billetPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('billetPagesMenuOpen')}
          >

            <span className="menu-icon">
              <i className="mdi mdi-ticket"></i>
            </span>

            <span className="menu-title">
              <Trans>Billet</Trans>
            </span>

            <i className="menu-arrow"></i>

          </div>

          <Collapse in={menuState.billetPagesMenuOpen}>

            <div>
              <ul className="nav flex-column sub-menu">


                <li className="nav-item">

                  <Link
                    className={isPathActive('/billet-pages/liste-billet') ? 'nav-link active' : 'nav-link'}
                    to="/billet-pages/liste-billet"
                  >
                    <Trans>Liste</Trans>
                  </Link>

                </li>


                {/* {
                  renderSubMenu(
                    "Reservation",
                    "reservationMenuOpen",
                    [
                      {
                        path: "/billet-pages/reservation/liste-reservation",
                        label: "Liste"
                      },
                      {
                        path: "/billet-pages/reservation/formulaire-reservation",
                        label: "Formulaire"
                      }
                    ]
                  )
                }

                {
                  renderSubMenu(
                    "Confirmation",
                    "confirmationMenuOpen",
                    [
                      {
                        path: "/billet-pages/confirmation/liste-confirmation",
                        label: "Liste"
                      },
                      {
                        path: "/billet-pages/confirmation/formulaire-confirmation",
                        label: "Formulaire"
                      }
                    ]
                  )
                } */}

              </ul>
            </div>

          </Collapse>

        </li>

        {/* Paiement */}
        <li className={isPathActive('/paiement-pages') ? 'nav-item menu-items active' : 'nav-item menu-items'}>

          <div
            className={menuState.paiementPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('paiementPagesMenuOpen')}
          >
            <span className="menu-icon">
              <i className="mdi mdi-receipt"></i>
            </span>

            <span className="menu-title">
              <Trans>Paiement</Trans>
            </span>

            <i className="menu-arrow"></i>
          </div>

          <Collapse in={menuState.paiementPagesMenuOpen}>
            <div>
              <ul className="nav flex-column sub-menu">

                {
                  renderSubMenu(
                    "Facture",
                    "factureMenuOpen",
                    [
                      {
                        path: "/paiement-pages/facture/liste-facture",
                        label: "Liste"
                      }
                      // ,
                      // {
                      //   path: "/paiement-pages/facture/formulaire-facture",
                      //   label: "Formulaire"
                      // }
                    ]
                  )
                }

                {
                  renderSubMenu(
                    "Reglement",
                    "reglementMenuOpen",
                    [
                      {
                        path: "/paiement-pages/reglement/liste-reglement",
                        label: "Liste"
                      },
                      // {
                      //   path: "/paiement-pages/reglement/formulaire-reglement",
                      //   label: "Formulaire"
                      // }
                    ]
                  )
                }

              </ul>
            </div>
          </Collapse>

        </li>

        {/* GESTION DES UTILISATEURS — ADMINISTRATEURS UNIQUEMENT */}
        {/* {estAdministrateur && (
          <li
            className={
              isPathActive('/user-pages')
                ? 'nav-item menu-items active'
                : 'nav-item menu-items'
            }
          >
            <div
              className={
                menuState.userPagesMenuOpen
                  ? 'nav-link menu-expanded'
                  : 'nav-link'
              }
              onClick={() =>
                toggleMenuState('userPagesMenuOpen')
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleMenuState('userPagesMenuOpen');
                }
              }}
            >
              <span className="menu-icon">
                <i className="mdi mdi-account-multiple"></i>
              </span>

              <span className="menu-title">
                <Trans>Gestion des utilisateurs</Trans>
              </span>

              <i className="menu-arrow"></i>
            </div>

            <Collapse in={menuState.userPagesMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link
                      className={
                        isPathActive(
                          '/user-pages/liste-user'
                        )
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      to="/user-pages/liste-user"
                    >
                      <Trans>Liste des utilisateurs</Trans>
                    </Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>
        )} */}

        {/* PARAMÈTRES — GESTION ADMINISTRATIVE */}
        {estAdministrateur && (
          <li
            className={
              isPathActive('/setting-pages')
                ? 'nav-item menu-items active'
                : 'nav-item menu-items'
            }
          >
            <div
              className={
                menuState.settingPagesMenuOpen
                  ? 'nav-link menu-expanded'
                  : 'nav-link'
              }
              onClick={() => toggleMenuState('settingPagesMenuOpen')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleMenuState('settingPagesMenuOpen');
                }
              }}
            >
              <span className="menu-icon">
                <i className="mdi mdi-settings"></i>
              </span>

              <span className="menu-title">
                <Trans>Paramètres</Trans>
              </span>

              <i className="menu-arrow"></i>
            </div>

            <Collapse in={menuState.settingPagesMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link
                      className={
                        location.pathname === '/setting-pages/profils'
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      to="/setting-pages/profils"
                    >
                      <Trans>Profils</Trans>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={
                        location.pathname === '/setting-pages/utilisateurs'
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      to="/setting-pages/utilisateurs"
                    >
                      <Trans>Utilisateurs</Trans>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={
                        location.pathname === '/setting-pages/fonctionnalites'
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      to="/setting-pages/fonctionnalites"
                    >
                      <Trans>Fonctionnalités</Trans>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={
                        location.pathname === '/setting-pages/privileges'
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      to="/setting-pages/privileges"
                    >
                      <Trans>Privilèges</Trans>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={
                        location.pathname === '/setting-pages/groupes'
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      to="/setting-pages/groupes"
                    >
                      <Trans>Groupes</Trans>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={
                        location.pathname === '/setting-pages/settings'
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      to="/setting-pages/settings"
                    >
                      <Trans>Paramètres</Trans>
                    </Link>
                  </li>

                  {/* <li className="nav-item">
                    <Link to="/setting-pages/groupes">
                      Groupes d'utilisateurs
                    </Link>
                  </li> */}

                </ul>
              </div>
            </Collapse>
          </li>
        )}


      </ul>

    </nav>
  );
};

export default Sidebar;