import React, {useState} from 'react';

import '../Component.css';
import HopHeaders from './SubComponents/HopHeaders';
import CachePoisoning from './SubComponents/CachePoisoning';
import Cors from './SubComponents/Cors';
import CspBypass from './SubComponents/CspBypass';



const Core = props => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="container-fluid">
            <div className="row">
        <div className="bg-secondary checklistStyle pt-2 ml-4 col-3">
            <h4 className="ml-3 pt-2">Tests applicatifs essentiels</h4>
            <ul>
                <li style={{fontWeight: "bold"}}>Tests de configuration globale</li>
                <ul>
                    <li onClick={(e)=>setCurrentStep(0)}>Content Security Policy (CSP)</li>
                    <li onClick={(e)=>setCurrentStep(1)}>Cross-Origin Resource Sharing (CORS)</li>
                    <li onClick={(e)=>setCurrentStep(2)}>Confusion de dépendances</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Mauvaise configuration JSON Web Token (JWT)</li>
                    <li onClick={(e)=>setCurrentStep(4)}>Inclusion de fichiers / Traversée de répertoires</li>
                </ul>
                <li style={{fontWeight: "bold"}}>Tests du code côté client</li>
                <ul>
                    <li onClick={(e)=>setCurrentStep(5)}>Cross-Site Scripting reflété (XSS)</li>
                    <li onClick={(e)=>setCurrentStep(6)}>Cross-Site Scripting basé sur le DOM (XSS)</li>
                    <li onClick={(e)=>setCurrentStep(7)}>Pollution de prototype côté client (CSPP)</li>
                    <li onClick={(e)=>setCurrentStep(8)}>Injection de modèles côté client</li>
                    <li onClick={(e)=>setCurrentStep(9)}>Vulnérabilités PostMessage</li>
                    <li onClick={(e)=>setCurrentStep(10)}>Markup orphelin</li>
                    <li onClick={(e)=>setCurrentStep(11)}>Déni de service (DoS)</li>
                    <li onClick={(e)=>setCurrentStep(12)}>Divulgation d'informations</li>
                    <li onClick={(e)=>setCurrentStep(13)}>Identifiants privilégiés exposés</li>
                    <li onClick={(e)=>setCurrentStep(14)}>Redirection ouverte basée sur le DOM</li>
                    <li onClick={(e)=>setCurrentStep(15)}>Injection de contenu</li>
                    <li onClick={(e)=>setCurrentStep(16)}>Stockage de données non sécurisé</li>
                </ul>
                <li style={{fontWeight: "bold"}}>Tests du code côté serveur</li>
                <ul>
                    <li onClick={(e)=>setCurrentStep(19)}>Injection de commandes</li>
                    <li onClick={(e)=>setCurrentStep(20)}>Cross-Site Scripting stocké (XSS)</li>
                    <li onClick={(e)=>setCurrentStep(21)}>Cross-Site Scripting aveugle (XSS)</li>
                    <li onClick={(e)=>setCurrentStep(22)}>Injection de code</li>
                    <li onClick={(e)=>setCurrentStep(23)}>Pollution de prototype côté serveur (SSPP)</li>
                    <li onClick={(e)=>setCurrentStep(24)}>Désérialisation non sécurisée</li>
                    <li onClick={(e)=>setCurrentStep(25)}>Injection LDAP</li>
                    <li onClick={(e)=>setCurrentStep(26)}>Falsification de requête côté serveur (SSRF)</li>
                    <li onClick={(e)=>setCurrentStep(27)}>Inclusion de fichiers / Traversée de répertoires</li>
                    <li onClick={(e)=>setCurrentStep(28)}>Injection XPath</li>
                    <li onClick={(e)=>setCurrentStep(29)}>Falsification de requête intersite (CSRF)</li>
                    <li onClick={(e)=>setCurrentStep(30)}>Téléversement de fichiers sans restriction</li>
                    <li onClick={(e)=>setCurrentStep(31)}>Web shell via téléversement de fichier</li>
                    <li onClick={(e)=>setCurrentStep(32)}>Injection de modèles côté serveur</li>
                    <li onClick={(e)=>setCurrentStep(33)}>Entité externe XML (XXE)</li>
                    <li onClick={(e)=>setCurrentStep(34)}>Injection WebSocket</li>
                </ul>
                <li style={{fontWeight: "bold"}}>Tests sur les opérations de base de données</li>
                <ul>
                    <li onClick={(e)=>setCurrentStep(35)}>Injection SQL</li>
                    <li onClick={(e)=>setCurrentStep(36)}>NoInjection SQL</li>
                    <li onClick={(e)=>setCurrentStep(37)}>Injection GraphQL</li>
                    <li onClick={(e)=>setCurrentStep(38)}>Déni de service (DoS)</li>
                    <li onClick={(e)=>setCurrentStep(39)}>Divulgation d'informations</li>
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

export default Core;