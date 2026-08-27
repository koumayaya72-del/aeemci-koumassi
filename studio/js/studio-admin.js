/* ==========================================================================
   STUDIO AEEMCI KOUMASSI — MOTEUR D'ADMINISTRATION CMS COMPLET (STUDIO-ADMIN)
   ========================================================================== */

const CMS_DEFAUTS = {
  bureau: {
    presidentNom: "Sow Mohamed",
    presidentTitre: "Président Exécutif",
    presidentMandat: "Mandat 2025 – 2026",
    presidentMot: "L'AEEMCI Koumassi s'engage résolument pour l'excellence académique, spirituelle et l'épanouissement de la jeunesse musulmane.",
    presidentPhoto: "images/membres/sow-mohamed.jpg",
    sgNom: "Diabaté Fodé",
    contactTel1: "+225 05 45 30 51 80",
    contactTel2: "+225 07 57 47 73 72",
    adresseSiège: "Koumassi Sicogi, Collège La Colombe"
  },
  actualites: [
    {
      id: 101,
      titre: "Nuit Du MAHOULOUD 2026",
      categorie: "PROCHAIN ÉVÉNEMENT",
      date: "Nuit du 25 au 26 Août 2026 • Dès 20H",
      lieu: "Collège Moderne La Colombe (Koumassi)",
      description: "Thème : « Le Sermon d'Adieu : enseignements et leçons pour le musulman ». Célébration spirituelle & veillée d'invocations.",
      image: "images/maouloud.jpg"
    },
    {
      id: 102,
      titre: "SECOFIS 2026",
      categorie: "FORMATION",
      date: "22 au 28 juillet 2026",
      lieu: "Koumassi",
      description: "Séminaire d'orientation et de formation axé sur le renforcement des capacités, l'initiation professionnelle et le développement personnel.",
      image: "images/secofis.jpg"
    },
    {
      id: 103,
      titre: "SEFORES & Rentrée Solennelle",
      categorie: "ÉVÉNEMENT",
      date: "18 janvier 2026",
      lieu: "Koumassi",
      description: "Cérémonie officielle marquant le lancement des activités de l'année et le déploiement de la feuille de route du bureau sous le thème « Ensemble nous sommes plus forts ».",
      image: "images/rentree-solennelle.jpg"
    },
    {
      id: 104,
      titre: "Nuit de Prière & Veillée Spirituelle",
      categorie: "SPIRITUALITÉ",
      date: "23 Mai 2026",
      lieu: "Koumassi",
      description: "Veillée spirituelle de recueillement, d'invocations, de lecture coranique et de rappels religieux pour raffermir les cœurs.",
      image: "images/nuit-priere.jpg"
    },
    {
      id: 105,
      titre: "Journée de l'Excellence & de la Culture",
      categorie: "EXCELLENCE",
      date: "10 Mai 2026",
      lieu: "Koumassi",
      description: "Grand rassemblement annuel récompensant les meilleurs candidats et lauréats aux examens scolaires et concours coraniques de la commune de Koumassi.",
      image: "images/journee-excellence.jpg"
    },
    {
      id: 106,
      titre: "Iftar Solidaire & Partage Fraternel",
      categorie: "ACTION SOCIALE",
      date: "18 Mars 2026",
      lieu: "Koumassi",
      description: "Organisation de repas collectifs de rupture du jeûne et distribution de kits alimentaires d'urgence aux familles et étudiants dans le besoin.",
      image: "images/solidarite-ramadan.jpg"
    }
  ],
  formations: [
    {
      id: 201,
      intitule: "Module 1 : Tajwid & Coran",
      description: "Perfectionnement dans la récitation coranique et règles de Tajwid dispensé par des maîtres qualifiés.",
      lien: "https://wa.me/2250545305180?text=Je%20souhaite%20m'inscrire%20au%20module%20Tajwid",
      inscrits: 84
    },
    {
      id: 202,
      intitule: "Module 2 : Art Oratoire & Prise de Parole",
      description: "Techniques d'art oratoire, maîtrise de soi, structuration de discours et éloquence en public.",
      lien: "https://wa.me/2250545305180?text=Je%20souhaite%20m'inscrire%20au%20module%20Art%20Oratoire",
      inscrits: 120
    },
    {
      id: 203,
      intitule: "Module 3 : Soutien Scolaire BEPC & BAC",
      description: "Encadrement intensif en Mathématiques, Physique-Chimie, SVT et Français pour les candidats aux examens.",
      lien: "https://wa.me/2250545305180?text=Je%20souhaite%20m'inscrire%20au%20Soutien%20Scolaire",
      inscrits: 195
    }
  ],
  galerie: [],
  contact: {
    adresse: "Koumassi Sicogi, Collège La Colombe",
    tel1: "+225 05 45 30 51 80",
    tel2: "+225 07 57 47 73 72",
    email: "aeemci.koumassi@gmail.com",
    horaires: "Chaque Samedi à 15H00 (IST-ISG La Colombe)",
    whatsappLink: "https://chat.whatsapp.com/KUd1Zmc2JEfBsIWdH5HPdm"
  }
};

document.addEventListener('DOMContentLoaded', async function() {
  initialiserDonneesCMS();
  chargerProfilPresidentForm();
  chargerActualitesCMS();
  chargerFormationsCMS();
  chargerGalerieCMS();
  chargerMilitantsCMS();
  chargerContactForm();
  attacherGestionnairesTactiles();
  initialiserDragAndDropGalerie();
});

function initialiserDonneesCMS() {
  if (!localStorage.getItem('aeemci_cms_bureau')) {
    localStorage.setItem('aeemci_cms_bureau', JSON.stringify(CMS_DEFAUTS.bureau));
  }
  if (!localStorage.getItem('aeemci_cms_actualites')) {
    localStorage.setItem('aeemci_cms_actualites', JSON.stringify(CMS_DEFAUTS.actualites));
  }
  if (!localStorage.getItem('aeemci_cms_formations')) {
    localStorage.setItem('aeemci_cms_formations', JSON.stringify(CMS_DEFAUTS.formations));
  }
  if (!localStorage.getItem('aeemci_cms_contact')) {
    localStorage.setItem('aeemci_cms_contact', JSON.stringify(CMS_DEFAUTS.contact));
  }
  if (!localStorage.getItem('aeemci_cms_galerie')) {
    localStorage.setItem('aeemci_cms_galerie', JSON.stringify([]));
  }
}

// 1. GESTION DU BUREAU EXÉCUTIF & PRÉSIDENCE
function chargerProfilPresidentForm() {
  const bureau = JSON.parse(localStorage.getItem('aeemci_cms_bureau')) || CMS_DEFAUTS.bureau;
  
  const inputNom = document.getElementById('cmsPresidentNom');
  const inputTitre = document.getElementById('cmsPresidentTitre');
  const inputMandat = document.getElementById('cmsPresidentMandat');
  const inputMot = document.getElementById('cmsPresidentMot');
  const inputTel1 = document.getElementById('cmsContactTel1');
  const previewPhoto = document.getElementById('cmsPresidentPhotoPreview');

  if (inputNom) inputNom.value = bureau.presidentNom || '';
  if (inputTitre) inputTitre.value = bureau.presidentTitre || 'Président Exécutif';
  if (inputMandat) inputMandat.value = bureau.presidentMandat || 'Mandat 2025 – 2026';
  if (inputMot) inputMot.value = bureau.presidentMot || '';
  if (inputTel1) inputTel1.value = bureau.contactTel1 || '';
  if (previewPhoto && bureau.presidentPhoto) previewPhoto.src = bureau.presidentPhoto;
}

window.enregistrerBureauCMS = function(e) {
  if (e) e.preventDefault();
  
  let bureau = JSON.parse(localStorage.getItem('aeemci_cms_bureau')) || CMS_DEFAUTS.bureau;

  const nom = document.getElementById('cmsPresidentNom')?.value.trim();
  const titre = document.getElementById('cmsPresidentTitre')?.value.trim();
  const mandat = document.getElementById('cmsPresidentMandat')?.value.trim();
  const mot = document.getElementById('cmsPresidentMot')?.value.trim();
  const tel1 = document.getElementById('cmsContactTel1')?.value.trim();
  const fileInput = document.getElementById('cmsPresidentPhotoFile');

  if (nom) bureau.presidentNom = nom;
  if (titre) bureau.presidentTitre = titre;
  if (mandat) bureau.presidentMandat = mandat;
  if (mot) bureau.presidentMot = mot;
  if (tel1) bureau.contactTel1 = tel1;

  const sauvegarderEtNotifier = () => {
    localStorage.setItem('aeemci_cms_bureau', JSON.stringify(bureau));
    chargerProfilPresidentForm();
    alert("✅ Les informations de la Présidence ont été sauvegardées et mises à jour sur le site public !");
  };

  if (fileInput && fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      bureau.presidentPhoto = evt.target.result;
      sauvegarderEtNotifier();
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    sauvegarderEtNotifier();
  }
};

// 2. MODALES ÉVÉNEMENTS
window.ouvrirModalAjoutEvenement = function(id = null) {
  const modal = document.getElementById('modalAjoutEvenement');
  if (!modal) return;

  const titleEl = document.getElementById('modalEvenementTitreHeader');
  const idInput = document.getElementById('cmsActuId');

  if (id) {
    const actualites = JSON.parse(localStorage.getItem('aeemci_cms_actualites')) || [];
    const actu = actualites.find(a => a.id === id);
    if (actu) {
      if (titleEl) titleEl.textContent = "✏️ Modifier l'Événement";
      if (idInput) idInput.value = actu.id;
      document.getElementById('cmsActuTitre').value = actu.titre || '';
      document.getElementById('cmsActuCategorie').value = actu.categorie || 'Événement';
      document.getElementById('cmsActuDate').value = actu.date || '';
      document.getElementById('cmsActuLieu').value = actu.lieu || '';
      document.getElementById('cmsActuDesc').value = actu.description || '';
    }
  } else {
    if (titleEl) titleEl.textContent = "➕ Publier un Nouvel Événement";
    if (idInput) idInput.value = '';
    const form = document.getElementById('formAjoutActuCMS');
    if (form) form.reset();
  }

  modal.classList.add('active');
};

window.fermerModalAjoutEvenement = function() {
  const modal = document.getElementById('modalAjoutEvenement');
  if (modal) modal.classList.remove('active');
};

// 3. GESTION DES ACTUALITÉS & ÉVÉNEMENTS (CRUD)
function chargerActualitesCMS() {
  const actualites = JSON.parse(localStorage.getItem('aeemci_cms_actualites')) || CMS_DEFAUTS.actualites;
  const container = document.getElementById('containerActualitesCMS');
  if (!container) return;

  container.innerHTML = '';

  if (actualites.length === 0) {
    container.innerHTML = `<p style="color: var(--texte-secondaire); padding: 20px;">Aucun événement publié pour le moment. Cliquez sur "Publier un Événement" pour commencer.</p>`;
    return;
  }

  actualites.forEach(actu => {
    const card = document.createElement('div');
    card.style.cssText = "border: 1px solid var(--bordure-carte); border-radius: 14px; padding: 20px; background: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--ombre-carte);";
    card.innerHTML = `
      <div>
        <span class="badge-statut valide" style="margin-bottom: 10px; display: inline-block;">${actu.categorie}</span>
        <h4 style="font-size: 1.15rem; color: var(--vert-institutionnel); font-weight: 800; margin-bottom: 6px;">${actu.titre}</h4>
        <p style="font-size: 0.85rem; color: var(--or-sombre); font-weight: 700; margin-bottom: 10px;">📅 ${actu.date} • 📍 ${actu.lieu}</p>
        <p style="font-size: 0.88rem; color: var(--texte-secondaire); margin-bottom: 18px; line-height: 1.5;">${actu.description}</p>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button class="bouton-action-contour btn-touch-evt" onclick="ouvrirModalAjoutEvenement(${actu.id})" style="flex: 1; justify-content: center;">✏️ Modifier</button>
        <button class="bouton-action-contour btn-touch-evt" onclick="supprimerActualiteCMS(${actu.id})" style="border-color: #EF4444; color: #EF4444; flex: 1; justify-content: center;">🗑️ Supprimer</button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.ajouterActualiteCMS = function(e) {
  if (e) e.preventDefault();

  const idInput = document.getElementById('cmsActuId');
  const idEdit = idInput ? idInput.value : '';
  const titre = document.getElementById('cmsActuTitre')?.value.trim();
  const categorie = document.getElementById('cmsActuCategorie')?.value || "Événement";
  const date = document.getElementById('cmsActuDate')?.value.trim();
  const lieu = document.getElementById('cmsActuLieu')?.value.trim();
  const description = document.getElementById('cmsActuDesc')?.value.trim();
  const fileInput = document.getElementById('cmsActuImageFile');

  if (!titre || !description) {
    alert("Veuillez saisir au moins le titre et la description de l'événement.");
    return;
  }

  const enregistrer = (imageUrl) => {
    let actualites = JSON.parse(localStorage.getItem('aeemci_cms_actualites')) || CMS_DEFAUTS.actualites;

    if (idEdit) {
      const idx = actualites.findIndex(a => a.id == idEdit);
      if (idx !== -1) {
        actualites[idx].titre = titre;
        actualites[idx].categorie = categorie;
        actualites[idx].date = date || "Prochainement";
        actualites[idx].lieu = lieu || "Koumassi";
        actualites[idx].description = description;
        if (imageUrl) actualites[idx].image = imageUrl;
      }
    } else {
      const nouvelleActu = {
        id: Date.now(),
        titre: titre,
        categorie: categorie,
        date: date || "Prochainement",
        lieu: lieu || "Koumassi",
        description: description,
        image: imageUrl || "images/maouloud.jpg"
      };
      actualites.unshift(nouvelleActu);
    }

    try {
      localStorage.setItem('aeemci_cms_actualites', JSON.stringify(actualites));
    } catch (err) {
      console.error("Quota localStorage dépassé:", err);
    }

    chargerActualitesCMS();
    fermerModalAjoutEvenement();
    alert("✅ L'événement a été publié et mis à jour en temps réel sur le site public !");
  };

  if (fileInput && fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      compresserImageCanvas(evt.target.result, 800, 0.8, function(imgCompressee) {
        enregistrer(imgCompressee);
      });
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    enregistrer(null);
  }
};

window.supprimerActualiteCMS = function(id) {
  if (confirm("Voulez-vous vraiment supprimer cet événement de la publication ?")) {
    let actualites = JSON.parse(localStorage.getItem('aeemci_cms_actualites')) || [];
    actualites = actualites.filter(a => a.id !== id);
    localStorage.setItem('aeemci_cms_actualites', JSON.stringify(actualites));
    chargerActualitesCMS();
  }
};

// 4. GESTION DES MODULES DE FORMATION (CRUD)
function chargerFormationsCMS() {
  const formations = JSON.parse(localStorage.getItem('aeemci_cms_formations')) || CMS_DEFAUTS.formations;
  const container = document.getElementById('containerFormationsCMS');
  if (!container) return;

  container.innerHTML = '';

  if (formations.length === 0) {
    container.innerHTML = `<p style="color: var(--texte-secondaire); padding: 20px;">Aucun module de formation enregistré.</p>`;
    return;
  }

  formations.forEach(f => {
    const item = document.createElement('div');
    item.style.cssText = "border: 1px solid var(--bordure-carte); border-radius: 14px; padding: 20px; background: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--ombre-carte);";
    item.innerHTML = `
      <div>
        <h4 style="font-size: 1.1rem; color: var(--vert-institutionnel); font-weight: 800; margin-bottom: 8px;">🎓 ${f.intitule}</h4>
        <p style="font-size: 0.88rem; color: var(--texte-secondaire); margin-bottom: 12px; line-height: 1.5;">${f.description}</p>
        <span style="font-size: 0.82rem; color: var(--or-sombre); font-weight: 700;">👥 ${f.inscrits || 0} Inscrits en ce moment</span>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 14px;">
        <button class="bouton-action-contour btn-touch-evt" onclick="supprimerFormationCMS(${f.id})" style="border-color: #EF4444; color: #EF4444; width: 100%; justify-content: center;">🗑️ Supprimer</button>
      </div>
    `;
    container.appendChild(item);
  });
}

window.enregistrerFormationCMS = function(e) {
  if (e) e.preventDefault();

  const intitule = document.getElementById('cmsFormationIntitule')?.value.trim();
  const description = document.getElementById('cmsFormationDesc')?.value.trim();
  const lien = document.getElementById('cmsFormationLien')?.value.trim();

  if (!intitule || !description) {
    alert("Veuillez renseigner au moins l'intitulé et la description de la formation.");
    return;
  }

  let formations = JSON.parse(localStorage.getItem('aeemci_cms_formations')) || CMS_DEFAUTS.formations;

  const nouvelleFormation = {
    id: Date.now(),
    intitule: intitule,
    description: description,
    lien: lien || "https://wa.me/2250545305180",
    inscrits: 0
  };

  formations.push(nouvelleFormation);
  localStorage.setItem('aeemci_cms_formations', JSON.stringify(formations));
  chargerFormationsCMS();

  const form = document.getElementById('formAjoutFormationCMS');
  if (form) form.reset();

  alert("✅ Le module de formation a été ajouté et publié sur le site public !");
};

window.supprimerFormationCMS = function(id) {
  if (confirm("Voulez-vous vraiment supprimer ce module de formation ?")) {
    let formations = JSON.parse(localStorage.getItem('aeemci_cms_formations')) || [];
    formations = formations.filter(f => f.id !== id);
    localStorage.setItem('aeemci_cms_formations', JSON.stringify(formations));
    chargerFormationsCMS();
  }
};

// 5. GESTION DU TÉLÉVERSEMENT & GALERIE (UPLOAD + DRAG AND DROP)
window.declencherSelecteurPhotos = function() {
  const input = document.getElementById('inputUploadGalerie');
  if (input) input.click();
};

window.gererSelectionPhotos = function(event) {
  const files = event.target.files;
  if (files && files.length > 0) {
    traiterFichiersPhotos(files);
  }
};

function initialiserDragAndDropGalerie() {
  const dropZone = document.getElementById('dropZoneGalerie');
  if (!dropZone) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.style.borderColor = '#10B981', false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.style.borderColor = 'var(--or)', false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      traiterFichiersPhotos(files);
    }
  }, false);
}

function compresserImageCanvas(base64Str, maxDimension, quality, callback) {
  const img = new Image();
  img.onload = function() {
    let width = img.width;
    let height = img.height;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    const compressedUrl = canvas.toDataURL('image/jpeg', quality || 0.8);
    callback(compressedUrl);
  };
  img.onerror = function() {
    callback(base64Str);
  };
  img.src = base64Str;
}

function traiterFichiersPhotos(files) {
  let galerie = JSON.parse(localStorage.getItem('aeemci_cms_galerie')) || [];
  let compt = 0;

  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        compresserImageCanvas(evt.target.result, 1000, 0.8, function(urlCompressee) {
          galerie.unshift({
            id: Date.now() + Math.random(),
            url: urlCompressee,
            titre: file.name
          });
          compt++;
          if (compt === files.length) {
            try {
              localStorage.setItem('aeemci_cms_galerie', JSON.stringify(galerie));
            } catch (err) {
              console.error("Erreur de sauvegarde LocalStorage:", err);
            }
            chargerGalerieCMS();
            alert(`✅ ${compt} photo(s) ajoutée(s) avec succès à la galerie !`);
          }
        });
      };
      reader.readAsDataURL(file);
    }
  });
}

function chargerGalerieCMS() {
  const galerie = JSON.parse(localStorage.getItem('aeemci_cms_galerie')) || [];
  const grid = document.getElementById('gridGalerieCMS');
  if (!grid) return;

  grid.innerHTML = '';

  if (galerie.length === 0) {
    grid.innerHTML = `<p style="color: var(--texte-secondaire); grid-column: 1 / -1; padding: 10px;">Aucune nouvelle photo téléversée depuis le studio. Les photos d'archives s'affichent sur le site public.</p>`;
    return;
  }

  galerie.forEach(item => {
    const box = document.createElement('div');
    box.style.cssText = "position: relative; border-radius: 12px; overflow: hidden; border: 1px solid var(--bordure-carte); box-shadow: 0 4px 12px rgba(0,0,0,0.06); aspect-ratio: 1; background: #000;";
    box.innerHTML = `
      <img src="${item.url}" alt="${item.titre || 'Photo'}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;">
      <button class="bouton-table-action" onclick="supprimerPhotoGalerie(${item.id})" style="position: absolute; top: 6px; right: 6px; background: rgba(239, 68, 68, 0.9); color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; border: none; cursor: pointer;" title="Supprimer la photo">&times;</button>
    `;
    grid.appendChild(box);
  });
}

window.supprimerPhotoGalerie = function(id) {
  if (confirm("Supprimer cette photo de la galerie ?")) {
    let galerie = JSON.parse(localStorage.getItem('aeemci_cms_galerie')) || [];
    galerie = galerie.filter(g => g.id != id);
    localStorage.setItem('aeemci_cms_galerie', JSON.stringify(galerie));
    chargerGalerieCMS();
  }
};

// 6. SUPPORT TACTILE REHAUSSÉ
function attacherGestionnairesTactiles() {
  const boutonsTactiles = document.querySelectorAll('.bouton-action-pro, .bouton-action-contour, .modal-fermer, .btn-touch-evt');
  boutonsTactiles.forEach(btn => {
    btn.addEventListener('touchstart', function(e) {
      this.style.transform = 'scale(0.96)';
    }, { passive: true });

    btn.addEventListener('touchend', function(e) {
      this.style.transform = 'scale(1)';
    }, { passive: true });
  });
}

// 7. GESTION DES MILITANTS
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

// 8. GESTION DES COORDONNÉES & DU FOOTER DU SITE PUBLIC
function chargerContactForm() {
  const contact = JSON.parse(localStorage.getItem('aeemci_cms_contact')) || CMS_DEFAUTS.contact;

  if (document.getElementById('cmsContactAdresse')) document.getElementById('cmsContactAdresse').value = contact.adresse || '';
  if (document.getElementById('cmsContactTel1')) document.getElementById('cmsContactTel1').value = contact.tel1 || '';
  if (document.getElementById('cmsContactTel2')) document.getElementById('cmsContactTel2').value = contact.tel2 || '';
  if (document.getElementById('cmsContactEmail')) document.getElementById('cmsContactEmail').value = contact.email || '';
  if (document.getElementById('cmsContactHoraires')) document.getElementById('cmsContactHoraires').value = contact.horaires || '';
  if (document.getElementById('cmsContactWhatsappLink')) document.getElementById('cmsContactWhatsappLink').value = contact.whatsappLink || '';
}

window.enregistrerContactCMS = function(e) {
  if (e) e.preventDefault();

  const contact = {
    adresse: document.getElementById('cmsContactAdresse')?.value.trim(),
    tel1: document.getElementById('cmsContactTel1')?.value.trim(),
    tel2: document.getElementById('cmsContactTel2')?.value.trim(),
    email: document.getElementById('cmsContactEmail')?.value.trim(),
    horaires: document.getElementById('cmsContactHoraires')?.value.trim(),
    whatsappLink: document.getElementById('cmsContactWhatsappLink')?.value.trim()
  };

  localStorage.setItem('aeemci_cms_contact', JSON.stringify(contact));
  alert("✅ Les coordonnées et liens du site public ont été mis à jour avec succès !");
};
