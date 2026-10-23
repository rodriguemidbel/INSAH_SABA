import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';

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

const ListeReservation = lazy(() => import('./billet-pages/reservation/ListeReservation'));
const FormulaireReservation = lazy(() => import('./billet-pages/reservation/FormulaireReservation'));
const ModifierReservation = lazy(() => import('./billet-pages/reservation/ModifierReservation'));

const ListeConfirmation = lazy(() => import('./billet-pages/confirmation/ListeConfirmation'));
const FormulaireConfirmation = lazy(() => import('./billet-pages/confirmation/FormulaireConfirmation'));
const ModifierConfirmation = lazy(() => import('./billet-pages/confirmation/ModifierConfirmation'));

const ListeFacture = lazy(() => import('./paiement-pages/facture/ListeFacture'));
const FormulaireFacture = lazy(() => import('./paiement-pages/facture/FormulaireFacture'));
const ModifierFacture = lazy(() => import('./paiement-pages/facture/ModifierFacture'));
const FactureRegle = lazy(() => import('./paiement-pages/facture/FactureRegle'));
const FactureNonRegle = lazy(() => import('./paiement-pages/facture/FactureNonRegle'));

const ListeReglement = lazy(() => import('./paiement-pages/reglement/ListeReglement'));
const FormulaireReglement = lazy(() => import('./paiement-pages/reglement/FormulaireReglement'));
const ModifierReglement = lazy(() => import('./paiement-pages/reglement/ModifierReglement'));

const Settings = lazy(() => import('./setting-pages/Settings'));
const AccountSetting = lazy(() => import('./setting-pages/AccountSetting'));
const SecuriteAccount = lazy(() => import('./setting-pages/SecuriteAccount'));

const ListeFournisseur = lazy(() => import('./fournisseur-pages/ListeFournisseur'));
const FormulaireFournisseur = lazy(() => import('./fournisseur-pages/FormulaireFournisseur'));
const ChoiceFournisseur = lazy(() => import('./fournisseur-pages/ChoiceFournisseur'));

const ListeBillet = lazy(() => import('./billet-pages/ListeBillet'));


class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Route exact path="/dashboard" component={ Dashboard } />

          <Route path="/basic-ui/buttons" component={ Buttons } />
          <Route path="/basic-ui/dropdowns" component={ Dropdowns } />
          <Route path="/basic-ui/typography" component={ Typography } />

          <Route path="/form-Elements/basic-elements" component={ BasicElements } />

          <Route path="/tables/basic-table" component={ BasicTable } />

          <Route path="/icons/mdi" component={ Mdi } />

          <Route path="/charts/chart-js" component={ ChartJs } />


          <Route path="/user-pages/login-1" component={ Login } />
          <Route path="/user-pages/register-1" component={ Register1 } />

          <Route path="/error-pages/error-404" component={ Error404 } />
          <Route path="/error-pages/error-500" component={ Error500 } />

          <Route path="/memo-pages/liste-memo" component={ ListeMemo } />
          <Route path="/memo-pages/formulaire-memo" component={ FormulaireMemo } />
          <Route path="/memo-pages/modifier-memo/:id" component={ ModifierMemo } />

          <Route path="/bon-pages/liste-bon" component={ ListeBon } />
          <Route path="/bon-pages/formulaire-bon" component={ FormulaireBon } />
          <Route path="/bon-pages/modifier-bon/:id" component={ ModifierBon } />

          <Route path="/billet-pages/reservation/liste-reservation" component={ ListeReservation } />
          <Route path="/billet-pages/reservation/formulaire-reservation" component={ FormulaireReservation } />
          <Route path="/billet-pages/reservation/modifier-reservation" component={ ModifierReservation } />

          <Route path="/billet-pages/confirmation/liste-confirmation" component={ ListeConfirmation } />
          <Route path="/billet-pages/confirmation/formulaire-confirmation" component={ FormulaireConfirmation } />
          <Route path="/billet-pages/confirmation/modifier-confirmation" component={ ModifierConfirmation } />

          <Route path="/paiement-pages/facture/liste-facture" component={ ListeFacture } />
          <Route path="/paiement-pages/facture/formulaire-facture/:memoId" component={ FormulaireFacture } />
          <Route path="/paiement-pages/facture/modifier-facture" component={ ModifierFacture } />
          <Route path="/paiement-pages/facture/facture-regle" component={ FactureRegle } />
          <Route path="/paiement-pages/facture/facture-non-regle" component={ FactureNonRegle } />

          <Route path="/paiement-pages/reglement/liste-reglement" component={ ListeReglement } />
          <Route path="/paiement-pages/reglement/formulaire-reglement/:id" component={ FormulaireReglement } />
          <Route path="/paiement-pages/reglement/modifier-reglement" component={ ModifierReglement } />

          <Route path="/setting-pages/settings" component={ Settings } />
          <Route path="/setting-pages/account-setting" component={ AccountSetting } />
          <Route path="/setting-pages/securite-account" component={ SecuriteAccount } />

          <Route path="/fournisseur-pages/liste-fournisseur" component={ ListeFournisseur } />
          <Route path="/fournisseur-pages/formulaire-fournisseur/:id" component={ FormulaireFournisseur } />
          <Route path="/fournisseur-pages/choice-fournisseur/:id" component={ ChoiceFournisseur } />
          {/* <Route path="/fournisseur-pages/modifier-fournisseur" component={ ModifierFournisseur } /> */}

          <Route path="/billet-pages/liste-billet" component={ ListeBillet } />

          {/* <Redirect to="/dashboard" /> */}
          <Redirect to="/user-pages/login-1" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;