import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Filter from 'bad-words';

import Concours from './models/concours.js';

const app = express();
const filter = new Filter();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

app.get('/concours', async (req, res) => {
  try {
    const concours = await Concours.find().sort({ dateAjout: -1 });
    res.json(concours);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de la récupération' });
  }
});

app.post('/concours', async (req, res) => {
  try {
    const { motCle, numero, gain, source, dateFin } = req.body;

    if (!motCle || !numero || !gain || !source || !dateFin) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const champs = [motCle, gain, source];
    for (const champ of champs) {
      if (filter.isProfane(champ)) {
        return res.status(400).json({ message: 'Contenu inapproprié détecté.' });
      }
    }

    const nouveauConcours = new Concours({
      motCle,
      numero,
      gain,
      source,
      dateFin: new Date(dateFin),
      dateAjout: new Date()
    });

    await nouveauConcours.save();
    res.status(201).json(nouveauConcours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout' });
  }
});

app.delete('/concours/:id', async (req, res) => {
  try {
    const deleted = await Concours.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Concours non trouvé' });
    res.json({ message: 'Concours supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
