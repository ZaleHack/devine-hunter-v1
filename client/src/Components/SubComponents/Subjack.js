import React from 'react';

import toast, { Toaster } from 'react-hot-toast';
import UrlForm from '../HelperComponents/UrlForm';

const Subjack = props => {


    const notify = e => {
        navigator.clipboard.writeText(e.target.innerText)
        toast(`"${e.target.innerText}" copié dans le presse-papiers`)
    }



    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b>Subjack est un outil Go de détection de prises de contrôle de sous-domaines. Il scanne rapidement une liste pour repérer ceux susceptibles d’être détournés. Vérifiez toujours les résultats pour éviter les faux positifs.</p>
                    <p><b>Objectif&nbsp;:</b> Repérer les cibles potentielles d’une prise de contrôle hostile de sous-domaine.</p>
                    <p><b>Téléchargement / installation&nbsp;:</b><span onClick={notify}>go get github.com/haccer/subjack</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>./subjack -w consolidated.{props.thisFqdn.fqdn}.txt -t 100 -timeout 45 -o subjack.{props.thisFqdn.fqdn}.txt -ssl</span></p>
                </div>
            </div>
            <div className="row">
                <UrlForm thisFqdn={props.thisFqdn} thisScanner="subjack"/>
            </div>
        </div>
    )
}

export default Subjack;