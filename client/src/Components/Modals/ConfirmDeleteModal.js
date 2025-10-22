import React from 'react';

const ConfirmDeleteModal = props => {
    return (
        <>
        <h4>Supprimer le FQDN&nbsp;?</h4>
        <h6>La suppression retirera définitivement toutes les données associées de la base. Cette action est irréversible. Confirmez-vous&nbsp;?</h6>
        <button>Confirmer</button>
        <button>Annuler</button>
        </>
    );
}

export default ConfirmDeleteModal;