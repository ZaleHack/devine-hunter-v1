import React, {useState} from 'react';

import '../Component.css';
import HopHeaders from './SubComponents/HopHeaders';
import CachePoisoning from './SubComponents/CachePoisoning';
import Cors from './SubComponents/Cors';
import CspBypass from './SubComponents/CspBypass';



const Creative = props => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="container-fluid">
            <div className="row">
        <div className="bg-secondary checklistStyle pt-2 ml-4 col-3">
            <h4 className="ml-3 pt-2">Tests applicatifs créatifs</h4>
            <ul>
                <li style={{fontWeight: "bold"}}>Tests d’identités et d’accès externes (IAM)</li>
                <ul>
                    <li onClick={(e)=>setCurrentStep(0)}>Mauvaise configuration OAuth</li>
                    <li onClick={(e)=>setCurrentStep(1)}>Mauvaise configuration SAML</li>
                    <li onClick={(e)=>setCurrentStep(1)}>Mauvaise configuration IAM Google Firebase</li>
                    <li onClick={(e)=>setCurrentStep(1)}>Mauvaise configuration IAM Keycloak</li>
                </ul>
                <li style={{fontWeight: "bold"}}>Tests de logique applicative</li>
                <ul>
                    <li onClick={(e)=>setCurrentStep(2)}>Référence d’objet indirecte (IDOR) - Lecture/Écriture</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Référence d’objet indirecte (IDOR) - Lecture seule</li>
                    <li onClick={(e)=>setCurrentStep(2)}>Contrôles d’accès insuffisants - Lecture/Écriture</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Contrôles d’accès insuffisants - Lecture seule</li>
                    <li onClick={(e)=>setCurrentStep(2)}>Contournement des contrôles d’accès - Lecture/Écriture</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Contournement des contrôles d’accès - Lecture seule</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Contournement 2FA/MFA</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Contournement de CAPTCHA</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Contournement du rate limiting / brute force</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Contournement des restrictions d’inscription</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Contournement des restrictions de paiement</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Contournement des restrictions de réinitialisation de mot de passe</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Conditions de concurrence</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Énumération de noms d’utilisateur</li>
                </ul>
                <li style={{fontWeight: "bold"}}>Tests OSINT et dépôts publics</li>
                <ul>
                    <li onClick={(e)=>setCurrentStep(0)}>Code source interne sur un dépôt GitHub public</li>
                    <li onClick={(e)=>setCurrentStep(1)}>Identifiants internes/privilégiés sur un dépôt GitHub public</li>
                    <li onClick={(e)=>setCurrentStep(1)}>Code source interne découvert par web scraping</li>
                    <li onClick={(e)=>setCurrentStep(1)}>Identifiants internes/privilégiés trouvés par web scraping</li>
                </ul>
            </ul>
        </div>
        <div className="bg-secondary workTableStyle col-8">
            {
                currentStep === 0 ?
                <HopHeaders thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 1 ?
                <CachePoisoning thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 8 ?
                <CspBypass thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 9 ?
                <Cors thisFqdn={props.thisFqdn} /> :
                ''
            }
        </div>
        </div>
        </div>
    )
}

export default Creative;