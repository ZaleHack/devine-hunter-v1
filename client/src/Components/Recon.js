import React, {useState} from 'react';

import Sublist3r from './SubComponents/Sublist3r';
import Amass from './SubComponents/Amass';
import Assetfinder from './SubComponents/Assetfinder';
import Gau from './SubComponents/Gau';
import Ctl from './SubComponents/Ctl';
import Consolidator from './SubComponents/Consolidator';
import Httprobe from './SubComponents/Httprobe';
import EyeWitness from './SubComponents/EyeWitness';
import Shosubgo from './SubComponents/Shosubgo';
import Subfinder from './SubComponents/Subfinder';
import GithubSubdomains from './SubComponents/GithubSubdomains';
import GoSpider from './SubComponents/GoSpider';
import Hakrawler from './SubComponents/Hakrawler';
import SubDomainizer from './SubComponents/SubDomainizer';
import CloudRanges from './SubComponents/CloudRanges';
import DnMasscan from './SubComponents/DnMasscan';
import ShuffleDnsMassive from './SubComponents/ShuffleDnsMassive';
import ShuffleDnsCustom from './SubComponents/ShuffleDnsCustom';
import CustomWordlist from './SubComponents/CustomWordlist';
import FindWebServer from './SubComponents/FindWebServer';
import AddTargetUrl from './SubComponents/AddTargetUrl';
import GithubBruteDork from './SubComponents/GithubBruteDork';
import '../Component.css';

const Recon = props => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="container-fluid">
            <div className="row">
        <div className="bg-secondary checklistStyle pt-4 ml-4 col-3">
            <ul>
                <li>Énumération des sous-domaines</li>
                <ul>
                    <li>Collecte de sous-domaines</li>
                    <ul>
                        <li onClick={(e)=>setCurrentStep(0)}>Outil - Sublist3r</li>
                        <li onClick={(e)=>setCurrentStep(1)}>Outil - Amass</li>
                        <li onClick={(e)=>setCurrentStep(2)}>Outil - Assetfinder</li>
                        <li onClick={(e)=>setCurrentStep(3)}>Outil - GetAllUrls (gau)</li>
                        <li onClick={(e)=>setCurrentStep(4)}>Journaux de transparence des certificats</li>
                        <li onClick={(e)=>setCurrentStep(5)}>Outil - Shosubgo</li>
                        <li onClick={(e)=>setCurrentStep(6)}>Outil - Subfinder</li>
                        <li onClick={(e)=>setCurrentStep(7)}>Outil - Github-Subdomains</li>
                    </ul>
                    <li>Découverte de liens / JS</li>
                    <ul>
                        <li onClick={(e)=>setCurrentStep(9)}>Outil - GoSpider</li>
                        <li onClick={(e)=>setCurrentStep(10)}>Outil - Hakrawler</li>
                        <li onClick={(e)=>setCurrentStep(11)}>Outil - SubDomainizer</li>
                    </ul>
                    <li>Brute force de sous-domaines</li>
                    <ul>
                        <li onClick={(e)=>setCurrentStep(12)}>ShuffleDNS - Liste de mots massive</li>
                        <li onClick={(e)=>setCurrentStep(13)}>Créer une liste personnalisée</li>
                        <li onClick={(e)=>setCurrentStep(14)}>ShuffleDNS - Liste personnalisée</li>
                    </ul>
                    <li>Énumération des serveurs/ports</li>
                    <ul>
                        <li onClick={(e)=>setCurrentStep(15)}>Plages cloud</li>
                        <li onClick={(e)=>setCurrentStep(16)}>DnMasscan</li>
                        <li onClick={(e)=>setCurrentStep(17)}>Identifier les serveurs web</li>
                    </ul>
                </ul>
                <li>Analyse finale</li>
                <ul>
                    <li onClick={(e)=>setCurrentStep(18)}>Construire la liste des sous-domaines uniques</li>
                    <li onClick={(e)=>setCurrentStep(19)}>Vérifier l’état des sous-domaines - Httprobe</li>
                    <li onClick={(e)=>setCurrentStep(20)}>Analyse finale - EyeWitness</li>
                </ul>
                <li onClick={(e)=>setCurrentStep(21)}>Ajouter une URL cible</li>
                <li onClick={(e)=>setCurrentStep(22)}>Recherche Github avancée</li>
                <li>Résumé</li>
            </ul>
        </div>
        <div className="bg-secondary workTableStyle col-8">
            {
                currentStep === 0 ?
                <Sublist3r thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 1 ?
                <Amass thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 2 ?
                <Assetfinder thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 3 ?
                <Gau thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 4 ?
                <Ctl thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 5 ?
                <Shosubgo thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 6 ?
                <Subfinder thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 7 ?
                <GithubSubdomains thisFqdn={props.thisFqdn} /> :
                ''
            }

            {
                currentStep === 9 ?
                <GoSpider thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 10 ?
                <Hakrawler thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 11 ?
                <SubDomainizer thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 12 ?
                <ShuffleDnsMassive thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 13 ?
                <CustomWordlist thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 14 ?
                <ShuffleDnsCustom thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 15 ?
                <CloudRanges thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 16 ?
                <DnMasscan thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 17 ?
                <FindWebServer thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 18 ?
                <Consolidator thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 19 ?
                <Httprobe thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 20 ?
                <EyeWitness thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 21 ?
                <AddTargetUrl thisFqdn={props.thisFqdn} /> :
                ''
            }
            {
                currentStep === 22 ?
                <GithubBruteDork thisFqdn={props.thisFqdn} /> :
                ''
            }
        </div>
        </div>
        </div>
    )
}

export default Recon;