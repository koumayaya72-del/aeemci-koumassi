/**
 * AEEMCI Sous-Comité de Koumassi — Gestion des Bases de Données (Adhésions, Sport, Sorties & Contacts)
 * Lien officiel du groupe WhatsApp : https://chat.whatsapp.com/KUd1Zmc2JEfBsIWdH5HPdm
 */

const LIEN_GROUPE_WHATSAPP = "https://chat.whatsapp.com/KUd1Zmc2JEfBsIWdH5HPdm";

// Initialisation au chargement + Écouteur d'accès secret Administrateur
document.addEventListener('DOMContentLoaded', function () {
  actualiserCompteursBadges();

  // Accès secret Administrateur via Raccourci Clavier Ctrl + Shift + A
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      ouvrirModalBaseDonnees();
    }
  });

  // Accès secret Administrateur via URL avec le mot #admin
  if (window.location.hash === '#admin') {
    ouvrirModalBaseDonnees();
  }
});

// ==========================================
// 1. BASE DE DONNÉES GÉNÉRALE DES ADHÉRENTS
// ==========================================
function enregistrerAdhesionFormulaire(event) {
  event.preventDefault();
  
  const form = event.target;
  const nom = form.querySelector('input[name="nom"]')?.value || form.querySelectorAll('input')[0]?.value || "";
  const statut = form.querySelector('input[name="statut"]')?.value || form.querySelectorAll('input')[1]?.value || "";
  const quartier = form.querySelector('input[name="quartier"]')?.value || form.querySelectorAll('input')[2]?.value || "";
  const telephone = form.querySelector('input[name="telephone"]')?.value || form.querySelectorAll('input')[3]?.value || "";

  if (!nom || !telephone) {
    alert("Veuillez remplir au moins votre nom et votre numéro de téléphone / WhatsApp.");
    return;
  }

  const adherent = {
    id: "ADM-" + Date.now().toString().slice(-6),
    nom: nom,
    statut: statut,
    quartier: quartier,
    telephone: telephone,
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  };

  let liste = JSON.parse(localStorage.getItem('aeemci_adherents') || '[]');
  liste.unshift(adherent);
  localStorage.setItem('aeemci_adherents', JSON.stringify(liste));

  alert(`Félicitations ${nom} !\n\nVotre demande d'adhésion (ID: ${adherent.id}) a été enregistrée avec succès dans la base de données du Sous-Comité AEEMCI de Koumassi.\n\nVous allez maintenant être automatiquement redirigé(e) vers le groupe WhatsApp officiel.`);
  window.open(LIEN_GROUPE_WHATSAPP, "_blank");

  form.reset();
  actualiserCompteursBadges();
}

// ==========================================
// 2. BASE DE DONNÉES SPÉCIALE SPORT
// ==========================================
function enregistrerSportFormulaire(event) {
  event.preventDefault();

  const form = event.target;
  const nom = form.querySelector('input[name="nom"]')?.value || "";
  const telephone = form.querySelector('input[name="telephone"]')?.value || "";
  const quartier = form.querySelector('input[name="quartier"]')?.value || "";
  const discipline = form.querySelector('select[name="discipline"]')?.value || "Maracana / Football";

  if (!nom || !telephone) {
    alert("Veuillez saisir votre nom et votre numéro de téléphone / WhatsApp.");
    return;
  }

  const inscritSport = {
    id: "SPT-" + Date.now().toString().slice(-6),
    nom: nom,
    telephone: telephone,
    quartier: quartier,
    discipline: discipline,
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  };

  let listeSport = JSON.parse(localStorage.getItem('aeemci_inscriptions_sport') || '[]');
  listeSport.unshift(inscritSport);
  localStorage.setItem('aeemci_inscriptions_sport', JSON.stringify(listeSport));

  alert(`⚽ Inscription Sport Validée !\n\nMerci ${nom}. Vous êtes bien enregistré(e) dans la Base de Données Spéciale SPORT du Sous-Comité de Koumassi (${discipline}).\n\nRejoignez maintenant la communauté sportive sur WhatsApp.`);
  window.open(LIEN_GROUPE_WHATSAPP, "_blank");

  let modal = document.getElementById('modalFormulaireSport');
  if (modal) modal.classList.remove('ouvert');
  form.reset();
  actualiserCompteursBadges();
}

// ==========================================
// 3. BASE DE DONNÉES SPÉCIALE SORTIES & PIQUE-NIQUES
// ==========================================
function enregistrerSortieFormulaire(event) {
  event.preventDefault();

  const form = event.target;
  const nom = form.querySelector('input[name="nom"]')?.value || "";
  const telephone = form.querySelector('input[name="telephone"]')?.value || "";
  const quartier = form.querySelector('input[name="quartier"]')?.value || "";
  const nbPlaces = form.querySelector('select[name="places"]')?.value || "1 personne";

  if (!nom || !telephone) {
    alert("Veuillez saisir votre nom et votre numéro de téléphone / WhatsApp.");
    return;
  }

  const inscritSortie = {
    id: "SRT-" + Date.now().toString().slice(-6),
    nom: nom,
    telephone: telephone,
    quartier: quartier,
    nbPlaces: nbPlaces,
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  };

  let listeSorties = JSON.parse(localStorage.getItem('aeemci_inscriptions_sorties') || '[]');
  listeSorties.unshift(inscritSortie);
  localStorage.setItem('aeemci_inscriptions_sorties', JSON.stringify(listeSorties));

  alert(`🌿 Inscription Sortie Validée !\n\nFélicitations ${nom}. Votre place pour la prochaine sortie de détente (${nbPlaces}) a été réservée dans la Base de Données Spéciale SORTIES de Koumassi.\n\nRetrouvez l'équipe sur WhatsApp.`);
  window.open(LIEN_GROUPE_WHATSAPP, "_blank");

  let modal = document.getElementById('modalFormulaireSortie');
  if (modal) modal.classList.remove('ouvert');
  form.reset();
  actualiserCompteursBadges();
}

// ==========================================
// 4. POPUPS MODALES D'INSCRIPTION RAPIDE
// ==========================================
function ouvrirModalInscriptionSport() {
  let modal = document.getElementById('modalFormulaireSport');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalFormulaireSport';
    modal.className = 'modal-media-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-media-boite" style="max-width: 520px; width: 92%; background: #FFFFFF;">
      <div class="modal-media-entete">
        <span class="badge-couverture-medias" style="background: var(--vert-emeraude); color: #FFF;">Base de Données Sport</span>
        <h2 class="modal-media-titre">⚽ Inscription Pôle Sport Inter-Sous-Comités</h2>
        <button class="modal-media-fermer" onclick="document.getElementById('modalFormulaireSport').classList.remove('ouvert')">&times;</button>
      </div>
      <div class="modal-media-corps" style="padding: 20px;">
        <form onsubmit="enregistrerSportFormulaire(event)" style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Nom &amp; Prénom *</label>
            <input type="text" name="nom" required placeholder="Ex: Bakayoko Souleymane" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--bordure-douce); font-family: inherit;">
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Numéro WhatsApp *</label>
            <input type="tel" name="telephone" required placeholder="Ex: +225 0545305180" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--bordure-douce); font-family: inherit;">
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Quartier à Koumassi</label>
            <input type="text" name="quartier" placeholder="Ex: Prodomo, Sicogi" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--bordure-douce); font-family: inherit;">
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Discipline / Rôle *</label>
            <select name="discipline" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--bordure-douce); font-family: inherit;">
              <option value="Maracana / Football Masculin">Maracana / Football Masculin</option>
              <option value="Sport Féminin &amp; Fitness">Sport Féminin &amp; Fitness</option>
              <option value="Supporter &amp; Comité d'Animation">Supporter &amp; Comité d'Animation</option>
              <option value="Organisation Logistique Sport">Organisation Logistique Sport</option>
            </select>
          </div>
          <button type="submit" class="bouton-cta-primaire" style="margin-top: 10px; padding: 12px; border: none;">⚡ Valider mon Inscription Sport →</button>
        </form>
      </div>
    </div>
  `;
  modal.classList.add('ouvert');
}

function ouvrirModalInscriptionSortie() {
  let modal = document.getElementById('modalFormulaireSortie');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalFormulaireSortie';
    modal.className = 'modal-media-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-media-boite" style="max-width: 520px; width: 92%; background: #FFFFFF;">
      <div class="modal-media-entete">
        <span class="badge-couverture-medias" style="background: var(--or-sombre); color: #FFF;">Base de Données Sorties</span>
        <h2 class="modal-media-titre">🌿 Inscription Sortie de Détente &amp; Pique-nique</h2>
        <button class="modal-media-fermer" onclick="document.getElementById('modalFormulaireSortie').classList.remove('ouvert')">&times;</button>
      </div>
      <div class="modal-media-corps" style="padding: 20px;">
        <form onsubmit="enregistrerSortieFormulaire(event)" style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Nom &amp; Prénom *</label>
            <input type="text" name="nom" required placeholder="Ex: Touré Mariam" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--bordure-douce); font-family: inherit;">
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Numéro WhatsApp *</label>
            <input type="tel" name="telephone" required placeholder="Ex: +225 0757477372" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--bordure-douce); font-family: inherit;">
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Quartier à Koumassi</label>
            <input type="text" name="quartier" placeholder="Ex: Remblais, Sopim" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--bordure-douce); font-family: inherit;">
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Nombre de Personnes / Places *</label>
            <select name="places" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--bordure-douce); font-family: inherit;">
              <option value="1 Place (Moi uniquement)">1 Place (Moi uniquement)</option>
              <option value="2 Places (+ 1 invité)">2 Places (+ 1 invité)</option>
              <option value="3 Places (+ 2 invités)">3 Places (+ 2 invités)</option>
              <option value="Groupe / Famille (4+ places)">Groupe / Famille (4+ places)</option>
            </select>
          </div>
          <button type="submit" class="bouton-cta-primaire" style="margin-top: 10px; padding: 12px; border: none; background: var(--or-sombre);">🌿 Réserver ma Place pour la Sortie →</button>
        </form>
      </div>
    </div>
  `;
  modal.classList.add('ouvert');
}

// ==========================================
// 5. EXPORTATION DES BASES DE DONNÉES EN CSV
// ==========================================
function exporterAdherentsCSV() {
  let liste = JSON.parse(localStorage.getItem('aeemci_adherents') || '[]');
  if (liste.length === 0) {
    alert("Aucun adhérent enregistré dans la base de données.");
    return;
  }
  let csv = "ID Adherent;Nom et Prenom;Statut;Quartier Koumassi;Telephone WhatsApp;Date Inscription\n";
  liste.forEach(r => { csv += `"${r.id}";"${r.nom}";"${r.statut}";"${r.quartier}";"${r.telephone}";"${r.date}"\n`; });
  telechargerFichierCSV(csv, `AEEMCI_Koumassi_Adherents_${new Date().toISOString().slice(0,10)}.csv`);
}

function exporterSportCSV() {
  let liste = JSON.parse(localStorage.getItem('aeemci_inscriptions_sport') || '[]');
  if (liste.length === 0) {
    alert("Aucune inscription enregistrée dans la Base de Données SPORT.");
    return;
  }
  let csv = "ID Sport;Nom et Prenom;Telephone WhatsApp;Quartier;Discipline / Role;Date Inscription\n";
  liste.forEach(r => { csv += `"${r.id}";"${r.nom}";"${r.telephone}";"${r.quartier}";"${r.discipline}";"${r.date}"\n`; });
  telechargerFichierCSV(csv, `AEEMCI_Koumassi_Base_SPORT_${new Date().toISOString().slice(0,10)}.csv`);
}

function exporterSortiesCSV() {
  let liste = JSON.parse(localStorage.getItem('aeemci_inscriptions_sorties') || '[]');
  if (liste.length === 0) {
    alert("Aucune inscription enregistrée dans la Base de Données SORTIES.");
    return;
  }
  let csv = "ID Sortie;Nom et Prenom;Telephone WhatsApp;Quartier;Nombre de Places;Date Inscription\n";
  liste.forEach(r => { csv += `"${r.id}";"${r.nom}";"${r.telephone}";"${r.quartier}";"${r.nbPlaces}";"${r.date}"\n`; });
  telechargerFichierCSV(csv, `AEEMCI_Koumassi_Base_SORTIES_${new Date().toISOString().slice(0,10)}.csv`);
}

function telechargerFichierCSV(contenu, nomFichier) {
  const encodedUri = encodeURI("data:text/csv;charset=utf-8,\uFEFF" + contenu);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", nomFichier);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================
// 6. ESPACE CONFIDENTIEL ADMINISTRATEURS (PIN: 2026)
// ==========================================
function ouvrirModalBaseDonnees() {
  const code = prompt("Espace Confidentiel Administrateurs / Bureau : Veuillez saisir le code d'accès au registre (par défaut: 2026) :");
  if (code === "2026" || code === "aeemci") {
    afficherTableauAdherentsModal('adherents');
  } else if (code !== null) {
    alert("Code d'accès incorrect. Seuls les administrateurs et membres autorisés du bureau peuvent consulter le registre.");
  }
}

function afficherTableauAdherentsModal(ongletActif = 'adherents') {
  let modal = document.getElementById('modalBaseDonnees');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalBaseDonnees';
    modal.className = 'modal-media-overlay';
    document.body.appendChild(modal);
  }

  let listeAdherents = JSON.parse(localStorage.getItem('aeemci_adherents') || '[]');
  let listeSport = JSON.parse(localStorage.getItem('aeemci_inscriptions_sport') || '[]');
  let listeSorties = JSON.parse(localStorage.getItem('aeemci_inscriptions_sorties') || '[]');

  let corpsTableau = "";

  if (ongletActif === 'sport') {
    if (listeSport.length === 0) {
      corpsTableau = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666;">Aucune inscription dans la Base Spéciale Sport.</td></tr>`;
    } else {
      listeSport.forEach(item => {
        corpsTableau += `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: 700; color: var(--vert-emeraude);">${item.id}</td>
            <td style="padding: 10px; font-weight: 600;">${item.nom}</td>
            <td style="padding: 10px; font-weight: 700; color: #25D366;">${item.telephone}</td>
            <td style="padding: 10px;">${item.quartier || 'Koumassi'}</td>
            <td style="padding: 10px;"><span class="badge-tag" style="font-size: 0.75rem;">${item.discipline}</span></td>
            <td style="padding: 10px; font-size: 0.82rem; color: #666;">${item.date}</td>
          </tr>
        `;
      });
    }
  } else if (ongletActif === 'sorties') {
    if (listeSorties.length === 0) {
      corpsTableau = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666;">Aucune inscription dans la Base Spéciale Sorties.</td></tr>`;
    } else {
      listeSorties.forEach(item => {
        corpsTableau += `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: 700; color: var(--or-sombre);">${item.id}</td>
            <td style="padding: 10px; font-weight: 600;">${item.nom}</td>
            <td style="padding: 10px; font-weight: 700; color: #25D366;">${item.telephone}</td>
            <td style="padding: 10px;">${item.quartier || 'Koumassi'}</td>
            <td style="padding: 10px;"><span class="badge-tag or" style="font-size: 0.75rem;">${item.nbPlaces}</span></td>
            <td style="padding: 10px; font-size: 0.82rem; color: #666;">${item.date}</td>
          </tr>
        `;
      });
    }
  } else {
    // Adhérents généraux
    if (listeAdherents.length === 0) {
      corpsTableau = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666;">Aucun adhérent dans la Base Générale.</td></tr>`;
    } else {
      listeAdherents.forEach(item => {
        corpsTableau += `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: 700; color: var(--vert-emeraude);">${item.id}</td>
            <td style="padding: 10px; font-weight: 600;">${item.nom}</td>
            <td style="padding: 10px;">${item.statut}</td>
            <td style="padding: 10px;">${item.quartier}</td>
            <td style="padding: 10px; font-weight: 700; color: #25D366;">${item.telephone}</td>
            <td style="padding: 10px; font-size: 0.82rem; color: #666;">${item.date}</td>
          </tr>
        `;
      });
    }
  }

  modal.innerHTML = `
    <div class="modal-media-boite" style="max-width: 960px; width: 95%;">
      <div class="modal-media-entete">
        <span class="badge-couverture-medias">Espace Confidentiel Administrateurs</span>
        <h2 class="modal-media-titre">Gestionnaire des Registres AEEMCI</h2>
        <button class="modal-media-fermer" onclick="document.getElementById('modalBaseDonnees').classList.remove('ouvert')">&times;</button>
      </div>

      <!-- NAV ONGLETS REGISTRE -->
      <div style="display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 2px solid var(--bordure-douce); padding-bottom: 8px; flex-wrap: wrap;">
        <button onclick="afficherTableauAdherentsModal('adherents')" class="bouton-cta-contour" style="font-size: 0.85rem; padding: 6px 14px; ${ongletActif === 'adherents' ? 'background: var(--vert-emeraude); color: #FFF;' : ''}">
          👥 Adhérents Généraux (${listeAdherents.length})
        </button>
        <button onclick="afficherTableauAdherentsModal('sport')" class="bouton-cta-contour" style="font-size: 0.85rem; padding: 6px 14px; ${ongletActif === 'sport' ? 'background: var(--vert-emeraude); color: #FFF;' : ''}">
          ⚽ Base Spéciale SPORT (${listeSport.length})
        </button>
        <button onclick="afficherTableauAdherentsModal('sorties')" class="bouton-cta-contour" style="font-size: 0.85rem; padding: 6px 14px; ${ongletActif === 'sorties' ? 'background: var(--or-sombre); color: #FFF;' : ''}">
          🌿 Base Spéciale SORTIES (${listeSorties.length})
        </button>
      </div>

      <div class="modal-media-corps" style="max-height: 65vh; overflow-y: auto;">
        <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
          ${ongletActif === 'sport' 
            ? '<button onclick="exporterSportCSV()" class="bouton-cta-primaire" style="font-size: 0.85rem; padding: 8px 16px;">📥 Exporter la Base SPORT en Excel / CSV</button>' 
            : ongletActif === 'sorties' 
            ? '<button onclick="exporterSortiesCSV()" class="bouton-cta-primaire" style="font-size: 0.85rem; padding: 8px 16px; background: var(--or-sombre);">📥 Exporter la Base SORTIES en Excel / CSV</button>' 
            : '<button onclick="exporterAdherentsCSV()" class="bouton-cta-primaire" style="font-size: 0.85rem; padding: 8px 16px;">📥 Exporter les Adhérents en Excel / CSV</button>'
          }
        </div>

        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
          <thead>
            <tr style="background: var(--vert-tendre); color: var(--vert-emeraude);">
              <th style="padding: 10px;">ID</th>
              <th style="padding: 10px;">Nom &amp; Prénom</th>
              <th style="padding: 10px;">${ongletActif === 'sport' ? 'Téléphone' : ongletActif === 'sorties' ? 'Téléphone' : 'Statut'}</th>
              <th style="padding: 10px;">Quartier</th>
              <th style="padding: 10px;">${ongletActif === 'sport' ? 'Discipline' : ongletActif === 'sorties' ? 'Places Réservées' : 'Téléphone'}</th>
              <th style="padding: 10px;">Date Inscription</th>
            </tr>
          </thead>
          <tbody>
            ${corpsTableau}
          </tbody>
        </table>
      </div>
    </div>
  `;

  modal.classList.add('ouvert');
}

function actualiserCompteursBadges() {
  let liste = JSON.parse(localStorage.getItem('aeemci_adherents') || '[]');
  let listeSport = JSON.parse(localStorage.getItem('aeemci_inscriptions_sport') || '[]');
  let listeSorties = JSON.parse(localStorage.getItem('aeemci_inscriptions_sorties') || '[]');

  document.querySelectorAll('.compteur-adherents-badge').forEach(b => b.textContent = liste.length);
  document.querySelectorAll('.compteur-sport-badge').forEach(b => b.textContent = listeSport.length);
  document.querySelectorAll('.compteur-sorties-badge').forEach(b => b.textContent = listeSorties.length);
}
