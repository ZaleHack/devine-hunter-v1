import React, { useState } from 'react';
import axios from 'axios';
import '../Component.css';

const INITIAL_STATE = {
  numero: '',
  imei: '',
  dateStart: '',
  dateEnd: '',
  timeStart: '',
  timeEnd: '',
};

const formatDisplayDate = (isoString, fallbackDate, fallbackTime) => {
  if (isoString) {
    const parsed = new Date(isoString);

    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(parsed);
    }
  }

  if (fallbackDate && fallbackTime) {
    return `${fallbackDate} • ${fallbackTime}`;
  }

  if (fallbackDate) {
    return fallbackDate;
  }

  if (fallbackTime) {
    return fallbackTime;
  }

  return 'Non disponible';
};

const FraudManagement = () => {
  const [formValues, setFormValues] = useState(INITIAL_STATE);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildPayload = () => {
    const payload = {};

    if (formValues.numero.trim()) {
      payload.numero = formValues.numero.trim();
    }

    if (formValues.imei.trim()) {
      payload.imei = formValues.imei.trim();
    }

    if (formValues.dateStart) {
      payload.dateStart = formValues.dateStart;
    }

    if (formValues.dateEnd) {
      payload.dateEnd = formValues.dateEnd;
    }

    if (formValues.timeStart) {
      payload.timeStart = formValues.timeStart;
    }

    if (formValues.timeEnd) {
      payload.timeEnd = formValues.timeEnd;
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setHasSearched(true);
    setError('');

    const payload = buildPayload();

    if (!payload.numero && !payload.imei) {
      setError('Veuillez saisir au moins un numéro ou un IMEI.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/fraud/search', payload);
      setResults(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur est survenue lors de la recherche.");
      }
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormValues(INITIAL_STATE);
    setResults(null);
    setError('');
    setHasSearched(false);
  };

  const renderResultsTitle = () => {
    if (!results) {
      return hasSearched ? 'Résultats de la recherche' : 'Vos résultats apparaîtront ici';
    }

    if (results.mode === 'numero') {
      return "IMEI associés au numéro recherché";
    }

    if (results.mode === 'imei') {
      return "Numéros associés à l'IMEI recherché";
    }

    return "Couples numéro / IMEI correspondants";
  };

  const renderResults = () => {
    if (!results) {
      return hasSearched && !loading && !error ? (
        <div className="fraud-empty-state">
          <div className="fraud-empty-icon" aria-hidden="true">🔍</div>
          <p>Aucun résultat ne correspond aux critères sélectionnés.</p>
        </div>
      ) : (
        <div className="fraud-empty-state">
          <div className="fraud-empty-icon" aria-hidden="true">💡</div>
          <p>Renseignez un numéro ou un IMEI ainsi qu'une période pour débuter votre analyse.</p>
        </div>
      );
    }

    if (!Array.isArray(results.results) || results.results.length === 0) {
      return (
        <div className="fraud-empty-state">
          <div className="fraud-empty-icon" aria-hidden="true">🔍</div>
          <p>Aucun enregistrement trouvé pour cette recherche.</p>
        </div>
      );
    }

    const cards = results.results.map((item) => {
      if (results.mode === 'numero') {
        return (
          <article className="fraud-card" key={item.imei}>
            <header className="fraud-card-header">
              <span className="fraud-chip">IMEI</span>
              <h3>{item.imei}</h3>
            </header>
            <div className="fraud-card-body">
              <span className="fraud-label">Dernière utilisation</span>
              <span className="fraud-value">
                {formatDisplayDate(item.lastUsage, item.lastUsageDate, item.lastUsageTime)}
              </span>
            </div>
          </article>
        );
      }

      if (results.mode === 'imei') {
        return (
          <article className="fraud-card" key={item.numero}>
            <header className="fraud-card-header">
              <span className="fraud-chip">Numéro</span>
              <h3>{item.numero}</h3>
            </header>
            <div className="fraud-card-body">
              <span className="fraud-label">Dernière utilisation</span>
              <span className="fraud-value">
                {formatDisplayDate(item.lastUsage, item.lastUsageDate, item.lastUsageTime)}
              </span>
            </div>
          </article>
        );
      }

      const compositeKey = `${item.numero}-${item.imei}`;

      return (
        <article className="fraud-card" key={compositeKey}>
          <header className="fraud-card-header">
            <div className="fraud-chip-group">
              <span className="fraud-chip">Numéro</span>
              <span className="fraud-chip">IMEI</span>
            </div>
            <h3>{item.numero} • {item.imei}</h3>
          </header>
          <div className="fraud-card-body">
            <span className="fraud-label">Dernière utilisation</span>
            <span className="fraud-value">
              {formatDisplayDate(item.lastUsage, item.lastUsageDate, item.lastUsageTime)}
            </span>
          </div>
        </article>
      );
    });

    return <div className="fraud-results-grid">{cards}</div>;
  };

  return (
    <div className="dashboard fraud-dashboard">
      <div className="fraud-header">
        <div>
          <h2>Gestion des fraudes</h2>
          <p className="fraud-subtitle">
            Identifiez en un clin d'œil les associations entre numéros et IMEI pour vos enquêtes.
          </p>
        </div>
        {results && (
          <span className="fraud-badge" aria-live="polite">
            {results.totalRecords} résultat{results.totalRecords > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <form className="fraud-form" onSubmit={handleSubmit}>
        <div className="fraud-form-grid">
          <div className="fraud-form-group">
            <label htmlFor="numero">Numéro</label>
            <input
              id="numero"
              name="numero"
              type="text"
              placeholder="Ex. 770000000"
              value={formValues.numero}
              onChange={handleInputChange}
            />
          </div>
          <div className="fraud-form-group">
            <label htmlFor="imei">IMEI</label>
            <input
              id="imei"
              name="imei"
              type="text"
              placeholder="Ex. 357805123456789"
              value={formValues.imei}
              onChange={handleInputChange}
            />
          </div>
          <div className="fraud-form-group">
            <label htmlFor="dateStart">Date de début</label>
            <input
              id="dateStart"
              name="dateStart"
              type="date"
              value={formValues.dateStart}
              onChange={handleInputChange}
            />
          </div>
          <div className="fraud-form-group">
            <label htmlFor="dateEnd">Date de fin</label>
            <input
              id="dateEnd"
              name="dateEnd"
              type="date"
              value={formValues.dateEnd}
              onChange={handleInputChange}
            />
          </div>
          <div className="fraud-form-group">
            <label htmlFor="timeStart">Heure de début</label>
            <input
              id="timeStart"
              name="timeStart"
              type="time"
              value={formValues.timeStart}
              onChange={handleInputChange}
              step="1"
            />
          </div>
          <div className="fraud-form-group">
            <label htmlFor="timeEnd">Heure de fin</label>
            <input
              id="timeEnd"
              name="timeEnd"
              type="time"
              value={formValues.timeEnd}
              onChange={handleInputChange}
              step="1"
            />
          </div>
        </div>

        <div className="fraud-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Recherche en cours…' : 'Rechercher'}
          </button>
          <button type="button" className="btn btn-light" onClick={handleReset} disabled={loading}>
            Réinitialiser
          </button>
        </div>
      </form>

      {error && (
        <div className="fraud-alert" role="alert">
          {error}
        </div>
      )}

      <section className="fraud-results-section" aria-live="polite">
        <header className="fraud-results-header">
          <h3>{renderResultsTitle()}</h3>
        </header>
        {renderResults()}
      </section>
    </div>
  );
};

export default FraudManagement;
