import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';
import PrivateRoute from './PrivateRoute';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));

const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
const Typography = lazy(() => import('./basic-ui/Typography'));

const BasicElements = lazy(() => import('./form-elements/BasicElements'));
const BasicTable = lazy(() => import('./tables/BasicTable'));
const Mdi = lazy(() => import('./icons/Mdi'));
const ChartJs = lazy(() => import('./charts/ChartJs'));

const Error404 = lazy(() => import('./error-pages/Error404'));
const Error500 = lazy(() => import('./error-pages/Error500'));

const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));

const ListeMemo = lazy(() => import('./memo-pages/ListeMemo'));
const FormulaireMemo = lazy(() => import('./memo-pages/FormulaireMemo'));
const ModifierMemo = lazy(() => import('./memo-pages/ModifierMemo'));

const ListeBon = lazy(() => import('./bon-pages/ListeBon'));
const FormulaireBon = lazy(() => import('./bon-pages/FormulaireBon'));
const ModifierBon = lazy(() => import('./bon-pages/ModifierBon'));

const ListeReservation = lazy(() =>
import('./billet-pages/reservation/ListeReservation')
);
const FormulaireReservation = lazy(() =>
import('./billet-pages/reservation/FormulaireReservation')
);
const ModifierReservation = lazy(() =>
import('./billet-pages/reservation/ModifierReservation')
);

const ListeConfirmation = lazy(() =>
import('./billet-pages/confirmation/ListeConfirmation')
);
const FormulaireConfirmation = lazy(() =>
import('./billet-pages/confirmation/FormulaireConfirmation')
);
const ModifierConfirmation = lazy(() =>
import('./billet-pages/confirmation/ModifierConfirmation')
);

const ListeFacture = lazy(() =>
import('./paiement-pages/facture/ListeFacture')
);
const FormulaireFacture = lazy(() =>
import('./paiement-pages/facture/FormulaireFacture')
);
const ModifierFacture = lazy(() =>
import('./paiement-pages/facture/ModifierFacture')
);
const FactureRegle = lazy(() =>
import('./paiement-pages/facture/FactureRegle')
);
const FactureNonRegle = lazy(() =>
import('./paiement-pages/facture/FactureNonRegle')
);

const ListeReglement = lazy(() =>
import('./paiement-pages/reglement/ListeReglement')
);
const FormulaireReglement = lazy(() =>
import('./paiement-pages/reglement/FormulaireReglement')
);
const ModifierReglement = lazy(() =>
import('./paiement-pages/reglement/ModifierReglement')
);

const Settings = lazy(() => import('./setting-pages/Settings'));
const AccountSetting = lazy(() =>
import('./setting-pages/AccountSetting')
);
const SecuriteAccount = lazy(() =>
import('./setting-pages/SecuriteAccount')
);

const ListeFournisseur = lazy(() =>
import('./fournisseur-pages/ListeFournisseur')
);
const FormulaireFournisseur = lazy(() =>
import('./fournisseur-pages/FormulaireFournisseur')
);
const ChoiceFournisseur = lazy(() =>
import('./fournisseur-pages/ChoiceFournisseur')
);

const ListeBillet = lazy(() => import('./billet-pages/ListeBillet'));

const ListeUser = lazy(() =>
    import('./user-pages/ListeUser')
);

const FormulaireUser = lazy(() =>
    import("./user-pages/FormulaireUser")
);

const ModifierUser = lazy(() =>
    import("./user-pages/ModifierUser")
);


const Profils = lazy(() =>
    import('./setting-pages/Profils')
);

const Utilisateurs = lazy(() =>
    import('./setting-pages/Utilisateurs')
);

const Fonctionnalites = lazy(() =>
    import('./setting-pages/Fonctionnalites')
);

const Privileges = lazy(() =>
    import('./setting-pages/Privileges')
);

const Groupes = React.lazy(() =>
  import("./setting-pages/Groupes")
);

class AppRoutes extends Component {
render() {
return (
<Suspense fallback={<Spinner />}> <Switch>
{/* Pages publiques */} 
                <Route
                    exact
                    path="/user-pages/login-1"
                    component={Login}
                />

                <Route
                    exact
                    path="/user-pages/register-1"
                    component={Register1}
                />

                <Route
                    exact
                    path="/error-pages/error-404"
                    component={Error404}
                />

                <Route
                    exact
                    path="/error-pages/error-500"
                    component={Error500}
                />

                {/* Tableau de bord */}
                <PrivateRoute
                    exact
                    path="/dashboard"
                    component={Dashboard}
                />

                {/* Interface générale */}
                <PrivateRoute
                    path="/basic-ui/buttons"
                    component={Buttons}
                />
                <PrivateRoute
                    path="/basic-ui/dropdowns"
                    component={Dropdowns}
                />
                <PrivateRoute
                    path="/basic-ui/typography"
                    component={Typography}
                />

                <PrivateRoute
                    path="/form-Elements/basic-elements"
                    component={BasicElements}
                />

                <PrivateRoute
                    path="/tables/basic-table"
                    component={BasicTable}
                />

                <PrivateRoute
                    path="/icons/mdi"
                    component={Mdi}
                />

                <PrivateRoute
                    path="/charts/chart-js"
                    component={ChartJs}
                />

                {/* Memos */}
                <PrivateRoute
                    exact
                    path="/memo-pages/liste-memo"
                    component={ListeMemo}
                />
                <PrivateRoute
                    exact
                    path="/memo-pages/formulaire-memo"
                    component={FormulaireMemo}
                />
                <PrivateRoute
                    exact
                    path="/memo-pages/modifier-memo/:id"
                    component={ModifierMemo}
                />

                {/* Bons de commande */}
                <PrivateRoute
                    exact
                    path="/bon-pages/liste-bon"
                    component={ListeBon}
                />
                <PrivateRoute
                    exact
                    path="/bon-pages/formulaire-bon"
                    component={FormulaireBon}
                />
                <PrivateRoute
                    exact
                    path="/bon-pages/modifier-bon/:id"
                    component={ModifierBon}
                />

                {/* Réservations de billets */}
                <PrivateRoute
                    exact
                    path="/billet-pages/reservation/liste-reservation"
                    component={ListeReservation}
                />
                <PrivateRoute
                    exact
                    path="/billet-pages/reservation/formulaire-reservation"
                    component={FormulaireReservation}
                />
                <PrivateRoute
                    exact
                    path="/billet-pages/reservation/modifier-reservation"
                    component={ModifierReservation}
                />

                {/* Confirmations de billets */}
                <PrivateRoute
                    exact
                    path="/billet-pages/confirmation/liste-confirmation"
                    component={ListeConfirmation}
                />
                <PrivateRoute
                    exact
                    path="/billet-pages/confirmation/formulaire-confirmation"
                    component={FormulaireConfirmation}
                />
                <PrivateRoute
                    exact
                    path="/billet-pages/confirmation/modifier-confirmation"
                    component={ModifierConfirmation}
                />

                {/* Factures */}
                <PrivateRoute
                    exact
                    path="/paiement-pages/facture/liste-facture"
                    component={ListeFacture}
                />
                <PrivateRoute
                    exact
                    path="/paiement-pages/facture/formulaire-facture/:memoId"
                    component={FormulaireFacture}
                />
                <PrivateRoute
                    exact
                    path="/paiement-pages/facture/modifier-facture"
                    component={ModifierFacture}
                />
                <PrivateRoute
                    exact
                    path="/paiement-pages/facture/facture-regle"
                    component={FactureRegle}
                />
                <PrivateRoute
                    exact
                    path="/paiement-pages/facture/facture-non-regle"
                    component={FactureNonRegle}
                />

                {/* Règlements */}
                <PrivateRoute
                    exact
                    path="/paiement-pages/reglement/liste-reglement"
                    component={ListeReglement}
                />
                <PrivateRoute
                    exact
                    path="/paiement-pages/reglement/formulaire-reglement/:id"
                    component={FormulaireReglement}
                />
                <PrivateRoute
                    exact
                    path="/paiement-pages/reglement/modifier-reglement"
                    component={ModifierReglement}
                />

                {/* Paramètres */}
                <PrivateRoute
                    exact
                    path="/setting-pages/settings"
                    component={Settings}
                />
                <PrivateRoute
                    exact
                    path="/setting-pages/account-setting"
                    component={AccountSetting}
                />
                <PrivateRoute
                    exact
                    path="/setting-pages/securite-account"
                    component={SecuriteAccount}
                />

                {/* Fournisseurs */}
                <PrivateRoute
                    exact
                    path="/fournisseur-pages/liste-fournisseur"
                    component={ListeFournisseur}
                />
                <PrivateRoute
                    exact
                    path="/fournisseur-pages/formulaire-fournisseur/:id"
                    component={FormulaireFournisseur}
                />
                <PrivateRoute
                    exact
                    path="/fournisseur-pages/choice-fournisseur/:id"
                    component={ChoiceFournisseur}
                />

                {/* Billets */}
                <PrivateRoute
                    exact
                    path="/billet-pages/liste-billet"
                    component={ListeBillet}
                />

                {/* Gestion des utilisateurs */}
                <PrivateRoute
                    exact
                    path="/user-pages/liste-user"
                    component={ListeUser}
                />

                <PrivateRoute
                    exact
                    path="/user-pages/formulaire-user"
                    component={FormulaireUser}
                />

                <PrivateRoute
                    exact
                    path="/user-pages/modifier-user/:id"
                    component={ModifierUser}
                />

                <PrivateRoute
                    exact
                    path="/setting-pages/profils"
                    component={Profils}
                />

                <PrivateRoute
                    exact
                    path="/setting-pages/utilisateurs"
                    component={Utilisateurs}
                />

                <PrivateRoute
                    exact
                    path="/setting-pages/fonctionnalites"
                    component={Fonctionnalites}
                />

                <PrivateRoute
                    exact
                    path="/setting-pages/privileges"
                    component={Privileges}
                />
                
                <PrivateRoute
                    exact
                    path="/setting-pages/groupes"
                    component={Groupes}
                />


                {/* Route inconnue */}
                <Redirect to="/dashboard" />
                {/* <Redirect to="/user-pages/login-1" /> */}
            </Switch>
        </Suspense>
    );
}

}

export default AppRoutes;
