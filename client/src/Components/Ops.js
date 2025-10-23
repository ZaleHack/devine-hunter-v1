import React, {useState} from 'react';

import '../Component.css';
import HopHeaders from './SubComponents/HopHeaders';
import CachePoisoning from './SubComponents/CachePoisoning';
import CacheDeception from './SubComponents/CacheDeception';
import HttpRequestSmuggling from './SubComponents/HttpRequestSmuggling';
import H2cSmuggling from './SubComponents/H2cSmuggling';
import HostHeader from './SubComponents/HostHeader';
import XsltInjection from './SubComponents/XsltInjection';
import EslInjection from './SubComponents/EsiInjection';
import IpSpoofing from './SubComponents/IpSpoofing';
import AwsS3 from './SubComponents/AwsS3';
import AwsCloudfront from './SubComponents/AwsCloudfront';
import AwsIamSts from './SubComponents/AwsIamSts';
import AwsCognito from './SubComponents/AwsCognito';
import AwsExposedDocDb from './SubComponents/AwsExposedDocDb';
import AwsEc2 from './SubComponents/AwsEc2';
import AwsRds from './SubComponents/AwsRds';
import AwsElasticBean from './SubComponents/AwsElasticBean';
import AwsApiGateway from './SubComponents/AwsApiGateway';
import AwsSns from './SubComponents/AwsSns';



const Ops = props => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="container-fluid">
            <div className="row">
        <div className="bg-secondary checklistStyle pt-2 ml-4 col-3">
        <h4 className="ml-3 pt-2">Tests infrastructure et DevOps</h4>
            <ul style={{listStyleType: "none"}}>
                <li style={{fontWeight: "bold"}}>Tests de proxy inverse</li>
                <ul style={{listStyleType: "none"}}>
                    <li onClick={(e)=>setCurrentStep(0)}>Abus des en-têtes hop-by-hop</li>
                    <li onClick={(e)=>setCurrentStep(1)}>Empoisonnement du cache web</li>
                    <li onClick={(e)=>setCurrentStep(2)}>Détournement de cache web</li>
                    <li onClick={(e)=>setCurrentStep(3)}>Contournement des requêtes HTTP (smuggling)</li>
                    <li onClick={(e)=>setCurrentStep(4)}>Smuggling H2C</li>
                    <li onClick={(e)=>setCurrentStep(5)}>Injection XSLT côté serveur</li>
                    <li onClick={(e)=>setCurrentStep(6)}>Injection Edge Side Includes (ESI)</li>
                    <li onClick={(e)=>setCurrentStep(7)}>Empoisonnement de l'en-tête Host</li>
                    <li onClick={(e)=>setCurrentStep(8)}>Usurpation d'adresse IP</li>
                </ul>
                <li style={{fontWeight: "bold"}}>Tests spécifiques au cloud</li>
                <ul style={{listStyleType: "none"}}>
                    <li onClick={(e)=>setCurrentStep(9)}>Mauvaise configuration de bucket AWS S3</li>
                    <li onClick={(e)=>setCurrentStep(10)}>Mauvaise configuration AWS CloudFront</li>
                    <li onClick={(e)=>setCurrentStep(11)}>Mauvaise configuration AWS IAM/STS</li>
                    <li onClick={(e)=>setCurrentStep(12)}>Mauvaise configuration AWS Elastic Beanstalk</li>
                    <li onClick={(e)=>setCurrentStep(13)}>Mauvaise configuration AWS API Gateway</li>
                    <li onClick={(e)=>setCurrentStep(14)}>Mauvaise configuration AWS Cognito</li>
                    <li onClick={(e)=>setCurrentStep(15)}>AWS DocumentDB sensible exposé</li>
                    <li onClick={(e)=>setCurrentStep(16)}>Mauvaise configuration AWS EC2</li>
                    <li onClick={(e)=>setCurrentStep(17)}>Mauvaise configuration AWS SNS</li>
                    <li onClick={(e)=>setCurrentStep(18)}>Mauvaise configuration AWS RDS</li>
                    <li onClick={(e)=>setCurrentStep(19)}>Énumération du locataire Azure</li>
                    <li onClick={(e)=>setCurrentStep(20)}>Énumération des utilisateurs Azure</li>
                    <li onClick={(e)=>setCurrentStep(21)}>Stockage Azure ouvert</li>
                    <li onClick={(e)=>setCurrentStep(22)}>Forcer les identifiants Azure</li>
                    <li onClick={(e)=>setCurrentStep(23)}>Mauvaise configuration Azure ACR</li>
                    <li onClick={(e)=>setCurrentStep(24)}>Mauvaise configuration Azure App Service</li>
                    <li onClick={(e)=>setCurrentStep(25)}>Mauvaise configuration de bucket public GCP</li>
                    <li onClick={(e)=>setCurrentStep(26)}>Workflows GitHub Actions sur GCP</li>
                </ul>
                <li style={{fontWeight: "bold"}}>Tests de serveurs web</li>
                <ul style={{listStyleType: "none"}}>
                    <li onClick={(e)=>setCurrentStep(27)}>Vulnérabilités et expositions courantes (CVE)</li>
                    <li onClick={(e)=>setCurrentStep(28)}>Fichiers de configuration exposés</li>
                    <li onClick={(e)=>setCurrentStep(29)}>Injection Server Side Includes (SSI)</li>
                    <li onClick={(e)=>setCurrentStep(30)}>Divulgation d'informations</li>
                </ul>
                <li style={{fontWeight: "bold"}}>Tests DNS</li>
                <ul style={{listStyleType: "none"}}>
                    <li onClick={(e)=>setCurrentStep(31)}>Rebinding DNS</li>
                    <li onClick={(e)=>setCurrentStep(32)}>Prise de contrôle de sous-domaine</li>
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
                currentStep === 2 ?
                <CacheDeception thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 3 ?
                <HttpRequestSmuggling thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 4 ?
                <H2cSmuggling thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 5 ?
                <XsltInjection thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 6 ?
                <EslInjection thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 7 ?
                <HostHeader thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 8 ?
                <IpSpoofing thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 9 ?
                <AwsS3 thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 10 ?
                <AwsCloudfront thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 11 ?
                <AwsIamSts thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 12 ?
                <AwsElasticBean thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 13 ?
                <AwsApiGateway thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 14 ?
                <AwsCognito thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 15 ?
                <AwsExposedDocDb thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 16 ?
                <AwsEc2 thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 17 ?
                <AwsSns thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 18 ?
                <AwsRds thisFqdn={props.thisFqdn} /> :
                ''
            }  
        </div>
        </div>
        </div>
    )
}

export default Ops;