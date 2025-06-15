import mongoose from 'mongoose';

const concoursSchema = new mongoose.Schema({
  motCle: { type: String, required: true },
  numero: { type: String, required: true },
  gain: { type: String, required: true },
  source: { type: String, required: true },
  dateFin: { type: Date, required: true },
  dateAjout: { type: Date, default: Date.now },
});

export default mongoose.model('Concours', concoursSchema);
