import React from 'react';

import toast, { Toaster } from 'react-hot-toast';

const Slackbot = props => {


    const notify = e => {
        navigator.clipboard.writeText(e.target.innerText)
        toast(`"${e.target.innerText}" copié dans le presse-papiers`)
    }



    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b> Sublert est un outil de veille qui exploite la transparence des certificats pour surveiller automatiquement les nouveaux sous-domaines déployés par une organisation et les certificats TLS/SSL correspondants.</p>
                    <p><b>Objectif&nbsp;:</b> Configurer un serveur privé virtuel (VPS) afin de recevoir, via Slack, une alerte dès qu’un nouveau certificat TLS/SSL est émis pour l’organisation cible.</p>
                    <p><b>Téléchargement / installation&nbsp;:</b><span onClick={notify}>sudo git clone https://github.com/yassineaboukir/sublert.git && cd sublert; sudo pip3 install virtualenv setuptools; virtualenv sublert; source sublert/bin/activate; sudo pip3 install -r requirements.txt;</span></p>
                    <p><b>Exécution&nbsp;:</b> La procédure détaillée de configuration de Slack et de Cron pour automatiser cet outil est décrite <a href="https://medium.com/@yassineaboukir/automated-monitoring-of-subdomains-for-fun-and-profit-release-of-sublert-634cfc5d7708" target="_blank" rel="noreferrer">dans cet article</a>.</p>
                </div>
            </div>
        </div>
    )
}

export default Slackbot;