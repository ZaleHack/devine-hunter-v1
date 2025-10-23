import React, {useState, useEffect} from 'react';
import Dashboard from '../Components/Dashboard';
import CveTesting from '../Components/CveTesting';
import Recon from '../Components/Recon';
import Enumeration from '../Components/Enumeration';
import Ops from '../Components/Ops';
import Chaining from '../Components/Chaining';
import Core from '../Components/Core';
import Logging from '../Components/Logging';
import Resources from '../Components/Resources';
import Creative from '../Components/Creative';
import ComingSoon from '../Components/ComingSoon';


const ACTIVE_TAB = {
    0: Dashboard,
    1: Recon,
    2: Enumeration,
    3: CveTesting,
    4: Ops,
    5: Core,
    6: Creative,
    7: Chaining,
    8: ComingSoon,
    9: Resources,
    10: Logging,
}

const Fqdn = props => {
    const [activeTab, setActiveTab] = useState(0);
    useEffect(()=>setActiveTab(0), [props.index]);
    console.log("Received FQDN in Fqdn.js:", [props.thisFqdn]);

    const methodologyTabs = [
        "Tableau de bord",
        "Reconnaissance",
        "Énumération",
        "Tests CVE",
        "Tests Ops",
        "Tests noyau",
        "Tests créatifs",
        "Chaînage",
        "Rapport",
        "Ressources",
        "Journalisation"
    ]

    const getActiveTab = () => {
        const Component = ACTIVE_TAB[activeTab]
        return <Component thisFqdn={props.thisFqdn} />
    }

    return (
        <>
        <nav className="methodology-nav">
            <div className="methodology-container">
                {methodologyTabs.map((tab, i) => (
                    <button
                        key={i}
                        className={`methodology-button ${i === activeTab ? 'active' : ''}`}
                        onClick={() => setActiveTab(i)}
                        aria-current="page"
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </nav>
        {getActiveTab()}
   
        </>
    );
}

export default Fqdn;