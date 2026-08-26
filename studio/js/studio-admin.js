/* ==========================================================================
   STUDIO AEEMCI KOUMASSI — MOTEUR D'ADMINISTRATION CMS COMPLET (STUDIO-ADMIN)
   ========================================================================== */

// Structure de données initiale du CMS (Bureau, Actualités, Militants)
const CMS_DEFAUTS = {
  bureau: {
    presidentNom: "Sow Mohamed",
    presidentMot: "L'AEEMCI Koumassi s'engage résolument pour l'excellence académique, spirituelle et l'épanouissement de la jeunesse musulmane.",
    presidentPhoto: "../images/president.jpg",
    sgNom: "Diabaté Fodé",
    contactTel1: "+225 05 45 30 51 80",
    contactTel2: "+225 07 57 47 73 72",
    adresseSiège: "Koumassi Sicogi, Collège La Colombe"
  },
  actualites: [
    {
      id: 101,
      titre: "Nuit du Mahouloud 2026 à Koumassi",
      categorie: "Événement Majeur",
      date: "25-26 Août 2026",
      lieu: "Collège Moderne La Colombe",
      description: "Grand rassemblement spirituel et conférences sur la vie du Prophète (SWS). Interventions de plusieurs guides religieux.",
      image: "../images/news1.jpg"
    },
    {
      id: 102,
      titre: "Lancement du Programme de Soutien BEPC & BAC",
      categorie: "Formations",
      date: "01 Septembre 2026",
      lieu: "Siège AEEMCI Koumassi",
      description: "Cours de renforcement gratuits organisés par la commission académique pour tous les élèves du sous-comité.",
      image: "../images/news2.jpg"
    }
  ]
};

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', async function() {
  initialiserDonneesCMS();
  chargerProfilPresidentForm();
  chargerActualitesCMS();
  chargerMilitantsCMS();
});

// 1. Initialiser le LocalStorage si première utilisation
function initialiserDonneesCMS() {
  if (!localStorage.getItem('aeemci_cms_bureau')) {
    localStorage.setItem('aeemci_cms_bureau', JSON.stringify(CMS_DEFAUTS.bureau));
  }
  if (!localStorage.getItem('aeemci_cms_actualites')) {
    localStorage.setItem('aeemci_cms_actualites', JSON.stringify(CMS_DEFAUTS.actualites));
  }
}

// 2. GESTION DU BUREAU EXÉCUTIF & PHOTO DU PRÉSIDENT
function chargerProfilPresidentForm() {
  const bureau = JSON.parse(localStorage.getItem('aeemci_cms_bureau')) || CMS_DEFAUTS.bureau;
  
  const inputNom = document.getElementById('cmsPresidentNom');
  const inputMot = document.getElementById('cmsPresidentMot');
  const inputTel1 = document.getElementById('cmsContactTel1');
  const previewPhoto = document.getElementById('cmsPresidentPhotoPreview');

  if (inputNom) inputNom.value = bureau.presidentNom || '';
  if (inputMot) inputMot.value = bureau.presidentMot || '';
  if (inputTel1) inputTel1.value = bureau.contactTel1 || '';
  if (previewPhoto && bureau.presidentPhoto) previewPhoto.src = bureau.presidentPhoto;
}

window.enregistrerBureauCMS = function(e) {
  if (e) e.preventDefault();
  
  let bureau = JSON.parse(localStorage.getItem('aeemci_cms_bureau')) || CMS_DEFAUTS.bureau;

  const nom = document.getElementById('cmsPresidentNom')?.value.trim();
  const mot = document.getElementById('cmsPresidentMot')?.value.trim();
  const tel1 = document.getElementById('cmsContactTel1')?.value.trim();
  const fileInput = document.getElementById('cmsPresidentPhotoFile');

  if (nom) bureau.presidentNom = nom;
  if (mot) bureau.presidentMot = mot;
  if (tel1) bureau.contactTel1 = tel1;

  // Traitement de l'upload d'image (Support du Glisser-Déposer & File Reader)
  if (fileInput && fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      bureau.presidentPhoto = evt.target.result;
      localStorage.setItem('aeemci_cms_bureau', JSON.stringify(bureau));
      chargerProfilPresidentForm();
      alert("✅ Les informations du Président et la photo ont été mises à jour sur le site public !");
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    localStorage.setItem('aeemci_cms_bureau', JSON.stringify(bureau));
    alert("✅ Les informations du Bureau Exécutif ont été sauvegardées avec succès !");
  }
};

// 3. GESTION DES ACTUALITÉS & ÉVÉNEMENTS (CRUD)
function chargerActualitesCMS() {
  const actualites = JSON.parse(localStorage.getItem('aeemci_cms_actualites')) || CMS_DEFAUTS.actualites;
  const container = document.getElementById('containerActualitesCMS');
  if (!container) return;

  container.innerHTML = '';

  if (actualites.length === 0) {
    container.innerHTML = `<p style="color: var(--texte-secondaire);">Aucune actualité publiée pour le moment.</p>`;
    return;
  }

  actualites.forEach(actu => {
    const card = document.createElement('div');
    card.style.cssText = "border: 1px solid var(--bordure-carte); border-radius: 14px; padding: 20px; background: #FFFFFF; position: relative;";
    card.innerHTML = `
      <span class="badge-statut valide" style="margin-bottom: 8px;">${actu.categorie}</span>
      <h4 style="font-size: 1.1rem; color: var(--vert-institutionnel); margin-bottom: 6px;">${actu.titre}</h4>
      <p style="font-size: 0.85rem; color: var(--or-sombre); font-weight: 700; margin-bottom: 8px;">📅 ${actu.date} • 📍 ${actu.lieu}</p>
      <p style="font-size: 0.88rem; color: var(--texte-secondaire); margin-bottom: 16px;">${actu.description}</p>
      <div style="display: flex; gap: 10px;">
        <button class="bouton-action-contour" onclick="supprimerActualiteCMS(${actu.id})" style="border-color: #EF4444; color: #EF4444; width: 100%; justify-content: center;">🗑️ Supprimer</button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.ajouterActualiteCMS = function(e) {
  if (e) e.preventDefault();

  const titre = document.getElementById('cmsActuTitre')?.value.trim();
  const categorie = document.getElementById('cmsActuCategorie')?.value || "Événement";
  const date = document.getElementById('cmsActuDate')?.value.trim();
  const lieu = document.getElementById('cmsActuLieu')?.value.trim();
  const description = document.getElementById('cmsActuDesc')?.value.trim();

  if (!titre || !description) {
    alert("Veuillez saisir au moins le titre et la description de l'événement.");
    return;
  }

  let actualites = JSON.parse(localStorage.getItem('aeemci_cms_actualites')) || CMS_DEFAUTS.actualites;

  const nouvelleActu = {
    id: Date.now(),
    titre: titre,
    categorie: categorie,
    date: date || "Prochainement",
    lieu: lieu || "Koumassi",
    description: description,
    image: "../images/logo.png"
  };

  actualites.unshift(nouvelleActu);
  localStorage.setItem('aeemci_cms_actualites', JSON.stringify(actualites));
  chargerActualitesCMS();

  // Reinitialiser le formulaire
  document.getElementById('formAjoutActuCMS')?.reset();
  alert("✅ L'événement a été publié avec succès sur le site public !");
};

window.supprimerActualiteCMS = function(id) {
  if (confirm("Voulez-vous vraiment supprimer cet événement de la publication ?")) {
    let actualites = JSON.parse(localStorage.getItem('aeemci_cms_actualites')) || [];
    actualites = actualites.filter(a => a.id !== id);
    localStorage.setItem('aeemci_cms_actualites', JSON.stringify(actualites));
    chargerActualitesCMS();
  }
};

// 4. GESTION DU REGISTRE DES MILITANTS & ADHÉSIONS
async function chargerMilitantsCMS() {
  let militants = [];
  if (window.militantsDb && typeof window.militantsDb.fetchMilitants === 'function') {
    militants = await window.militantsDb.fetchMilitants();
  } else {
    militants = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
  }

  const tbody1 = document.getElementById('tbodyMilitants');
  const tbody2 = document.getElementById('tbodyMilitantsComplet');

  const html = militants.map(m => {
    let bClass = m.statut === 'valide' ? 'valide' : (m.statut === 'rejete' ? 'rejete' : 'attente');
    let bText = m.statut === 'valide' ? 'Validé' : (m.statut === 'rejete' ? 'Rejeté' : 'En attente');
    return `
      <tr>
        <td><strong>${m.nom}</strong></td>
        <td>${m.quartier || 'Koumassi'}</td>
        <td>${m.ecole || 'Établissement non renseigné'}</td>
        <td>
          <a href="https://wa.me/225${m.telephone}?text=Assalamu%20alaykum%20${encodeURIComponent(m.nom)},%20votre%20demande%20d'adh%C3%A9sion%20AEEMCI%20a%20%C3%A9t%C3%A9%20trait%C3%A9e !" target="_blank" class="bouton-whatsapp">
            💬 ${m.telephone}
          </a>
        </td>
        <td><span class="badge-statut ${bClass}">${bText}</span></td>
        <td>
          <button class="bouton-table-action" onclick="validerMilitantCMS(${m.id})" title="Valider">✅</button>
          <button class="bouton-table-action" onclick="refuserMilitantCMS(${m.id})" title="Rejeter">🔴</button>
          <button class="bouton-table-action" onclick="supprimerMilitantCMS(${m.id})" title="Supprimer">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');

  if (tbody1) tbody1.innerHTML = html;
  if (tbody2) tbody2.innerHTML = html;

  // Mise à jour des compteurs statistiques KPI
  const kpiTotal = document.getElementById('kpiTotalMilitants');
  const kpiAttentes = document.getElementById('kpiAttentes');

  if (kpiTotal) kpiTotal.textContent = militants.filter(m => m.statut === 'valide').length || militants.length;
  if (kpiAttentes) kpiAttentes.textContent = militants.filter(m => m.statut === 'attente').length;
}

window.validerMilitantCMS = async function(id) {
  if (window.militantsDb && typeof window.militantsDb.updateStatus === 'function') {
    await window.militantsDb.updateStatus(id, 'valide');
  } else {
    let list = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
    const item = list.find(m => m.id === id);
    if (item) item.statut = 'valide';
    localStorage.setItem('aeemci_militants_db', JSON.stringify(list));
  }
  chargerMilitantsCMS();
};

window.refuserMilitantCMS = async function(id) {
  if (window.militantsDb && typeof window.militantsDb.updateStatus === 'function') {
    await window.militantsDb.updateStatus(id, 'rejete');
  } else {
    let list = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
    const item = list.find(m => m.id === id);
    if (item) item.statut = 'rejete';
    localStorage.setItem('aeemci_militants_db', JSON.stringify(list));
  }
  chargerMilitantsCMS();
};

window.supprimerMilitantCMS = async function(id) {
  if (confirm("Supprimer cette adhésion du registre ?")) {
    if (window.militantsDb && typeof window.militantsDb.deleteMilitant === 'function') {
      await window.militantsDb.deleteMilitant(id);
    } else {
      let list = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
      list = list.filter(m => m.id !== id);
      localStorage.setItem('aeemci_militants_db', JSON.stringify(list));
    }
    chargerMilitantsCMS();
  }
};
