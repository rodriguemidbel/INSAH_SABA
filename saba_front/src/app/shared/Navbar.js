import React, { Component } from 'react'; 
import { Dropdown } from 'react-bootstrap'; 
import { Link, withRouter } from 'react-router-dom'; 
import { Trans } from 'react-i18next'; 
import AxiosInstance from '../Axios'; 

class Navbar extends Component { 
    
    // constructor(props) { 
    
    //     super(props); this.state = { 
            
    //         search: "", 
    //         searchResults: [], 
    //         showSearchResults: false, 
    //         loadingSearch: false, 
    //         notifications: [], 
    //         loadingNotifications: false 
    //     }; 
        
    //     this.searchTimer = null; 
    
    // }
    
    constructor(props) {
        super(props);

        
        let utilisateur = null;

        try {
            utilisateur = JSON.parse(
                localStorage.getItem("user") || "null"
            );
        } catch (error) {
            console.error("Erreur de lecture du profil utilisateur :", error);
        }

        this.state = {
            search: "",
            searchResults: [],
            showSearchResults: false,
            loadingSearch: false,
            notifications: [],
            loadingNotifications: false,
            currentUser: utilisateur
        };

        this.searchTimer = null;
        

    }

    
    // ========================================================= // MOBILE SIDEBAR // ========================================================= 
    // 
    toggleOffcanvas = () => { 
        
        const sidebar = document.querySelector('.sidebar-offcanvas'); 
        
        if (sidebar) { sidebar.classList.toggle('active'); } 
    
    }; // ========================================================= // SIDEBAR ICON ONLY // ========================================================= 
    // 
    toggleSidebar = () => { 
        
        document.body.classList.toggle('sidebar-icon-only'); 
    
    }; // ========================================================= // CHARGEMENT INITIAL // ========================================================= 
    // 

    loadCurrentUser = () => {
        try {
            const utilisateur = JSON.parse(
            localStorage.getItem("user") || "null"
            );

        
            this.setState({
                currentUser: utilisateur
            });
        } catch (error) {
            console.error(
                "Impossible de récupérer l'utilisateur connecté :",
                error
            );

            this.setState({
                currentUser: null
            });
        }
        

    };


    // componentDidMount() { 
        
    //     this.loadNotifications(); 
    //     // Fermer les résultats de recherche si on clique ailleurs 
    //     document.addEventListener( 'mousedown', this.handleOutsideClick ); 
    // } 

    componentDidMount() {
        this.loadCurrentUser();
        this.loadNotifications();

        document.addEventListener(
            'mousedown',
            this.handleOutsideClick
        );
    }
    
    componentWillUnmount() { 
        
        document.removeEventListener( 'mousedown', this.handleOutsideClick ); 
        
        if (this.searchTimer) { 
            
            clearTimeout(this.searchTimer); 
        } 
    } 
    
    // ========================================================= // CLIC EN DEHORS DE LA RECHERCHE // ========================================================= 
    
    handleOutsideClick = (event) => { 
        
        if ( this.searchContainer && !this.searchContainer.contains(event.target) ) { 
            
            this.setState({ showSearchResults: false }); 
        
        } 
    
    }; 
    
    // ========================================================= // NORMALISER LES REPONSES DRF // ========================================================= 
    
    normalizeResponse = (data) => { 
        
        /* * Django REST Framework peut retourner : * * [ * {...}, * {...} * ] * * ou : * * { * count: 10, * results: [...] * } */ 
        
        if (Array.isArray(data)) { return data; } 
        
        if (data && Array.isArray(data.results)) { return data.results; } 
        
        return []; 
    
    }; 
    
    // ========================================================= // RECHERCHE GLOBALE // ========================================================= 
    
    handleSearchChange = (event) => { 
        
        const value = event.target.value; this.setState({ search: value }); 
        
        if (this.searchTimer) { clearTimeout(this.searchTimer); } 
        
        if (!value.trim()) { this.setState({ searchResults: [], showSearchResults: false, loadingSearch: false }); return; } 
        
        /* * Petit délai pour éviter de lancer les requêtes * à chaque caractère. */ 
        
        this.searchTimer = setTimeout(() => { this.performGlobalSearch(value.trim()); }, 350); }; 
        
        // ========================================================= // RECHERCHE DANS LES DONNÉES // ========================================================= 
        // 
        performGlobalSearch = async (query) => { this.setState({ loadingSearch: true, showSearchResults: true }); 
        
        const searchText = query.toLowerCase(); 
        
        try { 
            
            const [ memoResponse, fournisseurResponse, billetResponse, factureResponse, reglementResponse ] = await Promise.all([ 
                
                AxiosInstance.get('memo/'), 
                AxiosInstance.get('fournisseur/'), 
                AxiosInstance.get('billet/'),
                AxiosInstance.get('facture/'), 
                AxiosInstance.get('reglement/') 
            
            ]); 
            
            const memos = this.normalizeResponse(memoResponse.data); 
            
            const fournisseurs = this.normalizeResponse(fournisseurResponse.data); 
            
            const billets = this.normalizeResponse(billetResponse.data); 
            
            const factures = this.normalizeResponse(factureResponse.data); 
            
            const reglements = this.normalizeResponse(reglementResponse.data); 
            
            const results = []; 
            
            // ===================================================== // MEMOS // ===================================================== 
            // 
            memos .filter((memo) => { 
                
                return [ memo.reference_memo, memo.objet, memo.source_financement ] .filter(Boolean) .some((value) => String(value) .toLowerCase() .includes(searchText) ); 
            
            }) .slice(0, 5) .forEach((memo) => { 
                
                results.push({ type: 'Memo', icon: 'mdi-file-document-outline', color: 'text-primary', title: memo.reference_memo || `Mémo #${memo.id}`, description: memo.objet || 'Mémo', path: '/memo-pages/liste-memo', id: memo.id }); 
            
            }); 
            
            // ===================================================== // FOURNISSEURS // ===================================================== 
            
            fournisseurs .filter((fournisseur) => { 
                
                return [ fournisseur.agence, fournisseur.montant, fournisseur.observation ] .filter(Boolean) .some((value) => String(value) .toLowerCase() .includes(searchText) ); 
            
            }) .slice(0, 5) .forEach((fournisseur) => { 
                
                results.push({ type: 'Fournisseur', icon: 'mdi-office-building', color: 'text-success', title: fournisseur.agence || `Fournisseur #${fournisseur.id}`, description: fournisseur.observation || ( fournisseur.montant ? `Montant : ${fournisseur.montant}` : 'Fournisseur' ), path: '/fournisseur-pages/liste-fournisseur', id: fournisseur.id }); 
            
            }); 
            
            // ===================================================== // BILLETS // ===================================================== 
            
            billets .filter((billet) => { 
                
                return [ billet.nom, billet.prenom, billet.telephone, billet.destination, billet.montant ] .filter(Boolean) .some((value) => String(value) .toLowerCase() .includes(searchText) ); }) .slice(0, 5) .forEach((billet) => { 
                    
                    results.push({ type: 'Billet', icon: 'mdi-airplane', color: 'text-info', title: `${billet.prenom || ''} ${billet.nom || ''}` .trim() || `Billet #${billet.id}`, description: billet.destination || 'Billet', path: '/billet-pages/liste-billet', id: billet.id }); 
                
                }); 
                
                // ===================================================== // FACTURES // ===================================================== 
                // 
                factures .filter((facture) => { 
                    
                    return [ facture.reference_facture, facture.montant, facture.statut ] .filter(Boolean) .some((value) => String(value) .toLowerCase() .includes(searchText) ); }) .slice(0, 5) .forEach((facture) => { 
                        
                        results.push({ type: 'Facture', icon: 'mdi-file-document', color: 'text-warning', title: facture.reference_facture || `Facture #${facture.id}`, description: facture.statut ? `${facture.statut} - ${facture.montant || 0}` : `Montant : ${facture.montant || 0}`, path: '/paiement-pages/facture/liste-facture', id: facture.id }); 
                    
                    }); 
                    
                    // ===================================================== // RÈGLEMENTS // ===================================================== 
                    
                    reglements .filter((reglement) => { 
                        
                        return [ reglement.mode_paiement, reglement.service_financier, reglement.numero_cheque_ov, reglement.montant_regle, reglement.observation ] .filter(Boolean) .some((value) => String(value) .toLowerCase() .includes(searchText) ); }) .slice(0, 5) .forEach((reglement) => { 
                            
                            results.push({ type: 'Règlement', icon: 'mdi-cash-check', color: 'text-danger', title: reglement.mode_paiement || `Règlement #${reglement.id}`, description: reglement.montant_regle ? `Montant réglé : ${reglement.montant_regle}` : 'Règlement', path: '/paiement-pages/reglement/liste-reglement', id: reglement.id }); 
                        
                        }); 
                        
                        this.setState({ 
                            
                            searchResults: results, loadingSearch: false, showSearchResults: true }); 
                        
                        } catch (error) {
                            
                            console.error( "Erreur recherche globale :", error.response?.data || error ); 
                            
                            this.setState({ searchResults: [], loadingSearch: false, showSearchResults: true }); 
                        
                        } 
                    
                    }; 
                    
                    // ========================================================= // CLIQUER SUR UN RÉSULTAT // ========================================================= 
                    // 
                    handleSearchResultClick = (result) => { 
                        
                        this.setState({ search: "", searchResults: [], showSearchResults: false 

                        });
                        
                        this.props.history.push(result.path); 
                    
                    }; 
                    
                    // ========================================================= // EFFACER LA RECHERCHE // ========================================================= 
                    // 
                    clearSearch = () => { 
                        
                        if (this.searchTimer) { clearTimeout(this.searchTimer); } 
                        
                        this.setState({ 
                            
                            search: "", 
                            searchResults: [], 
                            showSearchResults: false, 
                            loadingSearch: false }); 
                        
                        }; 
                        
                        // ========================================================= // NOTIFICATIONS // ========================================================= 
                        
                        loadNotifications = async () => { 
                            
                            this.setState({ loadingNotifications: true }); 
                            
                            try { const response = await AxiosInstance.get('dashboard/'); 
                                
                                const data = response.data; const notifications = []; 
                                
                                // ----------------------------------------------------- // FACTURES IMPAYÉES // ----------------------------------------------------- 
                                
                                if ( data.facturesImpayees !== undefined && Number(data.facturesImpayees) > 0 ) { 
                                    
                                    notifications.push({ icon: 'mdi-file-alert', color: 'text-warning', title: `${data.facturesImpayees} 
                                        
                                        facture(s) impayée(s)`, 
                                        description: 'Vérifiez les factures en attente de règlement.', 
                                        path: '/paiement-pages/facture/liste-facture' }); 
                                    
                                    }
                                    
                                    // ----------------------------------------------------- // MÉMOS // ----------------------------------------------------- 
                                    
                                    if ( data.statistiques && Number(data.statistiques.memos) > 0 ) { 
                                        
                                        notifications.push({ icon: 'mdi-file-document', color: 'text-primary', title: `${data.statistiques.memos} mémo(s)`, description: 'Consulter les mémos enregistrés.', path: '/memo-pages/liste-memo' }); 
                                    
                                    } 
                                    
                                    // ----------------------------------------------------- // BILLETS // ----------------------------------------------------- 
                                    
                                    if ( data.statistiques && Number(data.statistiques.billets) > 0 ) {
                                        
                                        notifications.push({ icon: 'mdi-airplane', color: 'text-info', title: `${data.statistiques.billets} billet(s)`, description: 'Consulter les billets enregistrés.', path: '/billet-pages/liste-billet' }); 
                                    
                                    } 
                                    
                                    this.setState({ 
                                        
                                        notifications, loadingNotifications: false }); 
                                    
                                    } catch (error) { 
                                        
                                        console.error( "Erreur notifications :", error.response?.data || error ); 
                                        
                                        this.setState({ notifications: [], loadingNotifications: false }); 
                                    
                                    }
                                 
                                }; 
                                
                                // ========================================================= // CLIQUER SUR UNE NOTIFICATION // ========================================================= 
                                
                                handleNotificationClick = (notification) => { 
                                    
                                    this.props.history.push(notification.path); 
                                
                                }; 
                                
                                // ========================================================= // DASHBOARD // ========================================================= 
                                
                                goToDashboard = (event) => { 
                                    
                                    event.preventDefault(); this.props.history.push('/dashboard'); 
                                
                                }; 
                                
                                // ========================================================= // PARAMÈTRES // ========================================================= 
                                
                                goToSettings = (event) => { 
                                    
                                    event.preventDefault(); this.props.history.push('/setting-pages/settings'); 
                                
                                }; 
                                
                                // ========================================================= // DÉCONNEXION // ========================================================= 
                                
                                // handleLogout = (event) => { 
                                    
                                //     event.preventDefault(); 
                                    
                                //     /* * Ton projet actuel n'a pas montré de système * d'authentification Django/DRF. * * On nettoie donc les éventuels éléments * d'authentification côté navigateur. */ 
                                    
                                //     localStorage.removeItem('token'); 
                                    
                                //     localStorage.removeItem('access'); 
                                    
                                //     localStorage.removeItem('refresh'); 
                                    
                                //     sessionStorage.clear(); this.props.history.push('/'); 
                                
                                // }; 

                                handleLogout = (event) => {
                                    event.preventDefault();

                                    // Supprimer les éléments d'authentification du stockage local
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user");
                                    localStorage.removeItem("access");
                                    localStorage.removeItem("refresh");

                                    sessionStorage.clear();

                                    this.setState({
                                        currentUser: null,
                                        search: "",
                                        searchResults: [],
                                        showSearchResults: false,
                                        notifications: []
                                    });

                                    this.props.history.push("/");
                                    

                                };

                                
                                // ========================================================= // RENDER // ========================================================= 
                                
                                render() { 
                                    
                                    // const { search, searchResults, showSearchResults, loadingSearch, notifications, loadingNotifications } = this.state; 
                                    
                                    const {
                                        search,
                                        searchResults,
                                        showSearchResults,
                                        loadingSearch,
                                        notifications,
                                        loadingNotifications,
                                        currentUser
                                    } = this.state;

                                    const nomComplet = currentUser
                                    ? `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim()
                                    : "";

                                    const nomAffiche =
                                    nomComplet ||
                                    currentUser?.username ||
                                    "Utilisateur";

                                    const roleAffiche =
                                    currentUser?.role || "Utilisateur";


                                    return ( 
                                        
                                        <nav className="navbar p-0 fixed-top d-flex flex-row"> {
                                            
                                            /* =================================================== LOGO MOBILE =================================================== */} 
                                            
                                            <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center"> 
                                            
                                                <Link className="navbar-brand brand-logo-mini" to="/" > <img src={require('../../assets/images/logo-mini.svg')} alt="logo" /> </Link> 
                                                
                                            </div> 
                                            
                                            {/* =================================================== NAVBAR WRAPPER =================================================== */} 
                                            
                                            <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch"> 
                                            
                                                {/* ================================================= MENU SIDEBAR ================================================= */} 
                                                
                                                <button className="navbar-toggler align-self-center" type="button" onClick={this.toggleSidebar} title="Afficher / réduire le menu" > <span className="mdi mdi-menu"></span> </button> 
                                                
                                                {/* ================================================= SEARCH ================================================= */} 
                                                
                                                <ul className="navbar-nav w-100"> 
                                                    
                                                    <li className="nav-item w-100"> 
                                                    
                                                        <div className="nav-link mt-2 mt-md-0 d-none d-lg-flex search position-relative" ref={(element) => { this.searchContainer = element; }} > 
                                                        
                                                        <div className="input-group"> <span className="input-group-prepend"> <span className="input-group-text border-0 bg-transparent"> <i className="mdi mdi-magnify"></i> </span> </span> 
                                                        
                                                            <input type="text" className="form-control border-0" placeholder="Rechercher un mémo, fournisseur, billet, facture..." value={search} onChange={this.handleSearchChange} onFocus={() => { 
                                                                
                                                                    if (search.trim()) { this.setState({ showSearchResults: true }); } 
                                                                
                                                                }} 
                                                                
                                                            /> 
                                                                
                                                                {/* BOUTON EFFACER */} 
                                                                
                                                            {search && ( <button type="button" className="btn btn-link text-muted" onClick={this.clearSearch} title="Effacer" > <i className="mdi mdi-close"></i> </button> )} 
                                                            
                                                        </div> 
                                                        
                                                        {/* ================================================= RÉSULTATS RECHERCHE ================================================= */} 
                                                        
                                                        {showSearchResults && search.trim() && ( 
                                                            
                                                            <div className="search-results-dropdown" style={{ position: 'absolute', top: '100%', left: '15px', right: '15px', zIndex: 1050, background: '#fff', borderRadius: '0 0 8px 8px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', maxHeight: '420px', overflowY: 'auto' }} > 
                                                            
                                                                {/* CHARGEMENT */} 
                                                                
                                                                {loadingSearch && ( 
                                                                    
                                                                    <div className="p-3 text-center"> 
                                                                    
                                                                        <div className="spinner-border spinner-border-sm text-primary" role="status" ></div> 
                                                                        
                                                                        <span className="ml-2"> Recherche... </span> 
                                                                        
                                                                    </div> )} 
                                                                    
                                                                    {/* AUCUN RESULTAT */} {!loadingSearch && searchResults.length === 0 && ( 
                                                                        
                                                                        <div className="p-3 text-center text-muted"> <i className="mdi mdi-magnify-close mdi-24px"></i> <p className="mb-0 mt-2"> Aucun résultat pour : </p> <strong> 
                                                                        
                                                                            {search} </strong> 
                                                                        
                                                                        </div> )} 
                                                                        
                                                                    {/* RÉSULTATS */} 
                                                                    
                                                                    {!loadingSearch && searchResults.length > 0 && ( <> 
                                                                        
                                                                        <div className="p-2 border-bottom"> <small className="text-muted"> {searchResults.length} {' '} résultat(s) </small> </div> 
                                                                        
                                                                            {searchResults.map( (result, index) => ( 
                                                                                
                                                                                <button key={`${result.type}-${result.id}-${index}`} type="button" className="dropdown-item preview-item" onClick={() => this.handleSearchResultClick(result) } style={{ whiteSpace: 'normal' }} > 
                                                                                
                                                                                    <div className="preview-thumbnail"> 
                                                                                    
                                                                                        <div className="preview-icon bg-light rounded-circle"> <i className={`mdi ${result.icon} ${result.color}`} ></i> </div> 
                                                                                        
                                                                                    </div> 
                                                                                    
                                                                                    <div className="preview-item-content"> 
                                                                                    
                                                                                        <h6 className="preview-subject mb-1"> {result.title} </h6> 
                                                                                        
                                                                                        <p className="text-muted mb-0"> <span className="mr-2"> {result.type} </span> {result.description} </p> 
                                                                                        
                                                                                    </div> 
                                                                                
                                                                                </button> ) 
                                                                            
                                                                        )} </> 
                                                                            
                                                                    )} 
                                                                        
                                                            </div> 
                                                                    
                                                        )} 
                                                                    
                                                        </div> 
                                                        
                                                    </li> 
                                                    
                                                </ul> 
                                                
                                                {/* ================================================= RIGHT NAVBAR ================================================= */} 
                                                
                                                
                                                <ul className="navbar-nav navbar-nav-right"> 
                                                
                                                    {/* ================================================= DASHBOARD ================================================= */} 
                                                
                                                    <li className="nav-item d-none d-lg-block"> 
                                                
                                                        <a className="nav-link" href="/dashboard" onClick={this.goToDashboard} title="Dashboard" > <i className="mdi mdi-view-grid"></i> </a> 
                                                        
                                                    </li> 
                                                    
                                                    {/* ================================================= NOTIFICATIONS ================================================= */} 
                                                    
                                                    <Dropdown alignRight as="li" className="nav-item border-left" > 
                                                    
                                                        <Dropdown.Toggle as="a" className="nav-link count-indicator cursor-pointer" title="Notifications" > <i className="mdi mdi-bell"></i> 
                                                        
                                                            {notifications.length > 0 && ( <span className="count bg-danger"> {notifications.length} </span> )} 
                                                        
                                                        </Dropdown.Toggle> 
                                                    
                                                    <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list"> 
                                                    
                                                    <h6 className="p-3 mb-0"> Notifications </h6> 
                                                    
                                                    <Dropdown.Divider /> 
                                                    
                                                    {/* CHARGEMENT */} 
                                                    
                                                    {loadingNotifications && ( 
                                                        
                                                        <div className="p-3 text-center"> 
                                                        
                                                            <div className="spinner-border spinner-border-sm text-primary" role="status" ></div> 
                                                            
                                                            <span className="ml-2"> Chargement... </span> 
                                                            
                                                        </div> 
                                                    
                                                    )} 
                                                    
                                                    {/* AUCUNE NOTIFICATION */} 
                                                    
                                                    {!loadingNotifications && notifications.length === 0 && ( 
                                                        
                                                        <div className="p-3 text-center text-muted"> <i className="mdi mdi-bell-off mdi-24px"></i> 
                                                        
                                                            <p className="mb-0 mt-2"> Aucune notification </p> 
                                                            
                                                        </div> 
                                                    
                                                    )} 
                                                    
                                                    {/* NOTIFICATIONS */} 
                                                    
                                                    {!loadingNotifications && notifications.map( (notification, index) => (
                                                        
                                                        <React.Fragment key={index}> 
                                                        
                                                            <Dropdown.Item className="dropdown-item preview-item" onClick={() => this.handleNotificationClick( notification ) } > 
                                                            
                                                                <div className="preview-thumbnail"> 
                                                                
                                                                    <div className="preview-icon bg-light rounded-circle"> <i className={`mdi ${notification.icon} ${notification.color}`} ></i> </div> 
                                                                
                                                                </div> 
                                                                
                                                                <div className="preview-item-content"> 
                                                                
                                                                    <h6 className="preview-subject mb-1"> {notification.title} </h6> 
                                                                    
                                                                    <p className="text-muted ellipsis mb-0"> {notification.description} </p> 
                                                                    
                                                                </div> 
                                                                
                                                            </Dropdown.Item> 
                                                            
                                                            {index < notifications.length - 1 && ( <Dropdown.Divider /> )} 
                                                            
                                                        </React.Fragment> 
                                                        ) 
                                                    
                                                    )} 
                                                    
                                                    <Dropdown.Divider /> 
                                                    
                                                    <button type="button" className="dropdown-item text-center" onClick={this.goToDashboard} > Voir le dashboard </button> 
                                                    
                                                    </Dropdown.Menu> 
                                                    
                                                </Dropdown> 
                                                
                                                {/* ================================================= PROFIL ================================================= */} 
                                                
                                                <Dropdown alignRight as="li" className="nav-item" > 
                                                    
                                                    {/* <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret" > 
                                                        
                                                        <div className="navbar-profile"> 
                                                            
                                                            <img className="img-xs rounded-circle" src={require('../../assets/images/faces-clipart/pic-1.png')} alt="profile" /> 
                                                            
                                                            <p className="mb-0 d-none d-sm-block navbar-profile-name"> Utilisateur </p> 
                                                            
                                                            <i className="mdi mdi-menu-down d-none d-sm-block"></i> 
                                                            
                                                        </div> 
                                                        
                                                    </Dropdown.Toggle>  */}

                                                    <Dropdown.Toggle
                                                        as="a"
                                                        className="nav-link cursor-pointer no-caret"
                                                        title={`Connecté : ${nomAffiche}`}

                                                        >

                                                        
                                                        <div className="navbar-profile">
                                                        
                                                        
                                                            <img
                                                                className="img-xs rounded-circle"
                                                                src={require('../../assets/images/faces-clipart/pic-1.png')}
                                                                alt="Profil utilisateur"
                                                            />

                                                            <div className="d-flex flex-column ml-2">
                                                                <p className="mb-0 navbar-profile-name">
                                                                    {nomAffiche}
                                                                </p>

                                                                <small className="text-muted d-none d-md-block">
                                                                    {roleAffiche}
                                                                </small>
                                                            </div>

                                                            <i className="mdi mdi-menu-down ml-2"></i>
                                                        </div>
                                                        

                                                    </Dropdown.Toggle>

                                                    
                                                    <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu"> 
                                                        
                                                        <h6 className="p-3 mb-0"> Profil </h6> 
                                                        
                                                        <Dropdown.Divider /> 
                                                        
                                                        {/* PARAMÈTRES */} 
                                                        
                                                        {/* <Dropdown.Item as={Link} to="/setting-pages/settings" className="preview-item" > 
                                                        
                                                            <div className="preview-thumbnail"> 
                                                                
                                                                <div className="preview-icon bg-dark rounded-circle"> <i className="mdi mdi-settings text-success"></i> </div> 
                                                                
                                                            </div> 
                                                            
                                                            <div className="preview-item-content"> 
                                                                
                                                                <p className="preview-subject mb-1"> Paramètres </p> 
                                                                
                                                            </div> 
                                                            
                                                        </Dropdown.Item>  */}
                                                            
                                                            <Dropdown.Divider /> 
                                                            
                                                            {/* DASHBOARD */} 
                                                            
                                                            <Dropdown.Item onClick={this.goToDashboard} className="preview-item" > 
                                                                
                                                                <div className="preview-thumbnail"> 
                                                                    
                                                                    <div className="preview-icon bg-dark rounded-circle"> 
                                                                        
                                                                        <i className="mdi mdi-view-dashboard text-primary"></i> 
                                                                        
                                                                    </div> 
                                                                    
                                                                </div> 
                                                                
                                                                <div className="preview-item-content"> 
                                                                    
                                                                    <p className="preview-subject mb-1"> Dashboard </p> 
                                                                    
                                                                </div> </Dropdown.Item> <Dropdown.Divider /> 
                                                                
                                                                {/* DECONNEXION */} 
                                                                
                                                                <Dropdown.Item onClick={this.handleLogout} className="preview-item" > 
                                                                    
                                                                    <div className="preview-thumbnail"> 
                                                                        
                                                                        <div className="preview-icon bg-dark rounded-circle"> 
                                                                            
                                                                            <i className="mdi mdi-logout text-danger"></i> 
                                                                            
                                                                        </div> 
                                                                        
                                                                    </div> 
                                                                    
                                                                    <div className="preview-item-content"> 
                                                                        
                                                                        <p className="preview-subject mb-1"> Déconnexion </p> 
                                                                        
                                                                    </div> 
                                                                    
                                                                </Dropdown.Item> 
                                                                
                                                            </Dropdown.Menu> 
                                                            
                                                        </Dropdown> 
                                                        
                                                    </ul> 
                                                    
                                                    {/* ================================================= MOBILE SIDEBAR ================================================= */} 
                                                    
                                                    <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={this.toggleOffcanvas} title="Menu" > 
                                                        
                                                        <span className="mdi mdi-format-line-spacing"></span> 
                                                        
                                                    </button> 
                                                    
                                                </div> 
                                                
                                            </nav> 
                                            
                                    ); 
                                
                                } 
                            
                            } export default withRouter(Navbar);