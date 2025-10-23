import React from 'react';

import toast, { Toaster } from 'react-hot-toast';
import UrlForm from '../HelperComponents/UrlForm';

const GithubSearch = props => {


    const notify = e => {
        navigator.clipboard.writeText(e.target.innerText)
        toast(`"${e.target.innerText}" copié dans le presse-papiers`)
    }



    const org = props.thisFqdn.fqdn.replace(".com", "");

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b> Cette collection de scripts Python, PHP et Bash automatise les recherches GitHub de base pour cartographier rapidement l’empreinte d’une organisation.</p>
                    <p><b>Objectif&nbsp;:</b> Obtenir une première vue d’ensemble de la présence GitHub d’une organisation et orienter les investigations manuelles des chercheurs en sécurité.</p>
                    <p><b>Téléchargement / installation&nbsp;:</b><span onClick={notify}>sudo git clone https://github.com/gwen001/github-search.git; pip3 install -r requirements2.txt && pip3 install -r requirements3.txt</span></p>
                    <p><b>Exécution&nbsp;:</b>
                        <ul>
                            <li>Lancer les dorks par défaut&nbsp;: <span onClick={notify}>sudo python3 github-dorks.py -o {org} -d dorks.txt -e 10 &gt; dorks.{org}.github-search.txt</span></li>
                            <li>Tester des termes complémentaires&nbsp;: <span onClick={notify}>sudo php github-search.php -o {org} -s db_password &gt; search.{org}.github-search.txt</span></li>
                            <li>Rechercher les utilisateurs associés à l’organisation&nbsp;: <span onClick={notify}>sudo python3 github-users.py -k {org} &gt; users.{org}.github-search.txt</span></li>
                            <li>Recenser les employés via LinkedIn&nbsp;: <span onClick={notify}>sudo python3 github-employees.py -m linkedin -t "{org}" -p 3 &gt; employees.{org}.github-search.txt</span></li>
                        </ul>
                    </p>
                </div>
            </div>
            <div className="row">
                <UrlForm thisFqdn={props.thisFqdn} thisScanner="Github"/>
            </div>
        </div>
    )
}

export default GithubSearch;