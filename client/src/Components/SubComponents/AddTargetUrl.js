import React from 'react';
import UrlForm from '../HelperComponents/UrlForm';

const EyeWitness = props => {

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <h3>Ajouter des URL cibles</h3>
                    <p>À partir des résultats de reconnaissance, ajoutez les URL pertinentes à examiner durant l’étape d’énumération.</p>
                </div>
            </div>
            <div className="row">
                <UrlForm thisFqdn={props.thisFqdn} thisScanner="targetUrls"/>
            </div>
        </div>
    )
}

export default EyeWitness;