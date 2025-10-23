import React from 'react';

import toast, { Toaster } from 'react-hot-toast';


const CustomWordlist = props => {



    const notify = e => {
        navigator.clipboard.writeText(e.target.innerText)
        toast(`"${e.target.innerText}" copié dans le presse-papiers`)
    }
    


    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b> CeWL est une application Ruby qui explore un site web jusqu’à une profondeur définie, suit éventuellement les liens externes et génère une liste de mots utile pour les attaques par dictionnaire.</p>
                    <p><b>Objectif&nbsp;:</b> Construire une liste personnalisée pour le bruteforce de sous-domaines.</p>
                    <p><b>Téléchargement / Installation&nbsp;:</b><span onClick={notify}>sudo apt-get install cewl</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>cewl -d 2 -m 5 -o -a -w ~/Wordlists/custom.txt https://{props.thisFqdn.fqdn}</span></p>
                </div>
            </div>
        </div>
    )
}

export default CustomWordlist;