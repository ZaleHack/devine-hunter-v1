import React from 'react';

import toast, { Toaster } from 'react-hot-toast';
import UrlForm from '../HelperComponents/UrlForm';

const EyeWitness = props => {


    const notify = e => {
        navigator.clipboard.writeText(e.target.innerText)
        toast(`"${e.target.innerText}" copié dans le presse-papiers`)
    }



    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b> EyeWitness capture des captures d’écran, extrait les en-têtes serveurs et signale les identifiants par défaut connus.</p>
                    <p><b>Objectif&nbsp;:</b> À partir des FQDN actifs identifiés (Httprobe), exécuter EyeWitness pour repérer les cibles potentiellement vulnérables.</p>
                    <p><b>Téléchargement / Installation&nbsp;:</b><span onClick={notify}>git clone https://github.com/FortyNorthSecurity/EyeWitness.git; cd EyeWitness/Python/setup; sudo ./setup.sh; cd ../../;</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>./EyeWitness.py -f httproxy.{props.thisFqdn.fqdn}.txt</span></p>
                </div>
            </div>
            <div className="row">
                <UrlForm thisFqdn={props.thisFqdn} thisScanner="eyeWitness"/>
            </div>
        </div>
    )
}

export default EyeWitness;