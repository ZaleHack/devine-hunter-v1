const mongoose = require('mongoose');

const CdrRealtimeSchema = new mongoose.Schema(
  {
    numero_appelant: { type: String, index: true },
    imei_appelant: { type: String, index: true },
    date_debut_appel: { type: mongoose.Schema.Types.Mixed },
    heure_debut_appel: { type: mongoose.Schema.Types.Mixed },
  },
  {
    collection: 'cdr_realtime',
    strict: false,
    timestamps: false,
  }
);

module.exports.CdrRealtime = mongoose.model('CdrRealtime', CdrRealtimeSchema, 'cdr_realtime');
