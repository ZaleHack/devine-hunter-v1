import React from 'react';
import moduleContent from './moduleContent';

const Section = ({ title, items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <p><b>{title}</b></p>
      <ol>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ol>
    </>
  );
};

const ModuleTemplate = ({ contentKey }) => {
  const module = moduleContent[contentKey];

  if (!module) {
    return (
      <div className="container mt-2">
        <div className="row">
          <div className="col-12">
            <p>Contenu en cours de préparation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-2">
      <div className="row">
        <div className="col-12">
          <h3 className="pb-3 pt-3">{module.title}</h3>
          {module.summary && (
            <p><b>Résumé&nbsp;:</b> {module.summary}</p>
          )}
          <Section title="Objectifs&nbsp;:" items={module.goals} />
          <Section title="Méthodologie - Identification&nbsp;:" items={module.identify} />
          <Section title="Méthodologie - Exploitation&nbsp;:" items={module.exploit} />
          {module.notes && (
            <p className="mt-3"><b>Notes&nbsp;:</b> {module.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleTemplate;
