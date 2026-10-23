import React, {
    useEffect,
    useState
} from "react";

import AxiosInstance from "../Axios";

// ==============================
// COMPOSANTS
// ==============================

import DashboardHeader from "./components/DashboardHeader";
import StatCard from "./components/StatCard";

import BilletsChart from "./components/BilletsChart";
import FacturePieChart from "./components/FacturePieChart";
import FacturesParMoisChart from "./components/FacturesParMoisChart";

import RecentMemos from "./components/RecentMemos";
import RecentFactures from "./components/RecentFactures";
import RecentBillets from "./components/RecentBillets";


function Dashboard() {

    // ==============================
    // STATES
    // ==============================

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);


    // ==============================
    // CHARGEMENT DU DASHBOARD
    // ==============================

    const chargerDashboard = async () => {

        try {

            setLoading(true);

            setError(null);

            const response = await AxiosInstance.get(
                "/dashboard/"
            );

            console.log(
                "Données Dashboard :",
                response.data
            );

            setDashboard(
                response.data
            );

        }

        catch (error) {

            console.error(
                "Erreur Dashboard :",
                error
            );

            setError(
                "Impossible de charger le tableau de bord."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==============================
    // USE EFFECT
    // ==============================

    useEffect(() => {

        chargerDashboard();

    }, []);


    // ==============================
    // CHARGEMENT
    // ==============================

    if (loading) {

        return (

            <div className="content-wrapper">

                <div className="text-center mt-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="mt-3">

                        Chargement du tableau de bord...

                    </p>

                </div>

            </div>

        );

    }


    // ==============================
    // ERREUR
    // ==============================

    if (error) {

        return (

            <div className="content-wrapper">

                <div className="alert alert-danger">

                    {error}

                </div>

            </div>

        );

    }


    // ==============================
    // PROTECTION
    // ==============================

    if (!dashboard) {

        return (

            <div className="content-wrapper">

                <div className="alert alert-warning">

                    Aucune donnée disponible.

                </div>

            </div>

        );

    }


    // ==============================
    // RENDU
    // ==============================

    return (

        <div className="content-wrapper">


            {/* ========================================
                HEADER
            ======================================== */}

            <DashboardHeader />


            {/* ========================================
                STATISTIQUES
            ======================================== */}

            <div className="row">


                {/* Mémos */}

                <StatCard

                    title="Mémos"

                    value={
                        dashboard?.statistiques?.memos || 0
                    }

                    icon="mdi-file-document"

                    color="primary"

                    subtitle="Mémos enregistrés"

                />


                {/* Billets */}

                <StatCard

                    title="Billets"

                    value={
                        dashboard?.statistiques?.billets || 0
                    }

                    icon="mdi-airplane"

                    color="success"

                    subtitle="Billets créés"

                />

                {/* Montant Factures */}

                <StatCard

                    title="Montant Factures"

                    value={`${Number(
                        dashboard?.statistiques?.montantFactures || 0
                    ).toLocaleString()} FCFA`}

                    icon="mdi-receipt"

                    color="warning"

                    subtitle="Total facturé"

                />


                {/* Montant Règlements */}

                <StatCard

                    title="Montant Règlements"

                    value={`${Number(
                        dashboard?.statistiques?.montantReglements || 0
                    ).toLocaleString()} FCFA`}

                    icon="mdi-wallet"

                    color="success"

                    subtitle="Total réglé"

                />


            </div>


            {/* ========================================
                MONTANTS
            ======================================== */}

            <div className="row">


                {/* Montant Factures */}

                {/* <StatCard

                    title="Montant Factures"

                    value={`${Number(
                        dashboard?.statistiques?.montantFactures || 0
                    ).toLocaleString()} FCFA`}

                    icon="mdi-receipt"

                    color="warning"

                    subtitle="Total facturé"

                /> */}


                {/* Montant Règlements */}

                {/* <StatCard

                    title="Montant Règlements"

                    value={`${Number(
                        dashboard?.statistiques?.montantReglements || 0
                    ).toLocaleString()} FCFA`}

                    icon="mdi-wallet"

                    color="success"

                    subtitle="Total réglé"

                /> */}


            </div>


            {/* ========================================
                GRAPHIQUES
            ======================================== */}

            <div className="row mt-4">


                {/* Evolution des billets */}

                <div className="col-xl-8 col-lg-7">

                    <BilletsChart

                        data={
                            dashboard?.billetsParAnnee  || []
                        }

                    />

                </div>


                {/* Etat des factures */}

                <div className="col-xl-4 col-lg-5">

                    <FacturePieChart

                        payees={
                            dashboard?.facturesPayees || 0
                        }

                        impayees={
                            dashboard?.facturesImpayees || 0
                        }

                    />

                </div>


            </div>

            {/* <div className="row mt-4">

                <div className="col-xl-8 col-lg-7">

                    <FacturesParMoisChart
                        data={dashboard?.facturesParMois || []}
                    />

                </div>

            </div> */}


            {/* ========================================
                DERNIERS MEMOS
            ======================================== */}

            <div className="row mt-4">

                <div className="col-xl-6">

                    <RecentMemos

                        memos={
                            dashboard?.derniersMemos || []
                        }

                    />

                </div>

                <div className="col-xl-6">

                    <RecentFactures

                        factures={
                            dashboard?.dernieresFactures || []
                        }

                    />

                </div>


            </div>


            {/* ========================================
                DERNIERES FACTURES
            ======================================== */}

            <div className="row mt-4">

                {/* <div className="col-xl-6">

                    <RecentFactures

                        factures={
                            dashboard?.dernieresFactures || []
                        }

                    />

                </div> */}

                <div className="col-xl-12">

                    <RecentBillets
                        billets={dashboard?.derniersBillets || []}
                    />

                </div>

            </div>


        </div>

    );

}

export default Dashboard;