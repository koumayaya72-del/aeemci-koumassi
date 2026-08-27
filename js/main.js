/* ==========================================================================
   SITE PUBLIC AEEMCI KOUMASSI — SCRIPT DE SYNCHRONISATION DYNAMIQUE (MAIN.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  lancerSynchronisationGlobale();
});

// Écouteurs d'événements temps réel pour mise à jour instantanée sans rechargement de page
window.addEventListener('storage', function() {
  lancerSynchronisationGlobale();
});

window.addEventListener('focus', function() {
  lancerSynchronisationGlobale();
});

function lancerSynchronisationGlobale() {
  synchroniserBureauPublic();
  synchroniserActualitesPublic();
  synchroniserFormationsPublic();
  synchroniserStatistiquesPublic();
  synchroniserGaleriePublic();
  synchroniserContactPublic();
}

// 1. Synchronisation de la Présidence & Mot du Président
function synchroniserBureauPublic() {
  const bureauRaw = localStorage.getItem('aeemci_cms_bureau');
  if (!bureauRaw) return;

  try {
    const bureau = JSON.parse(bureauRaw);

    const nomEls = document.querySelectorAll('#site-nom-president, #publicPresidentNom, .carte-president .nom-president');
    const titreEls = document.querySelectorAll('#site-titre-president, #publicPresidentTitre');
    const mandatEls = document.querySelectorAll('#site-mandat-president');
    const motEls = document.querySelectorAll('#site-mot-president, #publicPresidentMot, .mot-du-president p');
    const photoEls = document.querySelectorAll('#site-photo-president, #publicPresidentPhoto, .carte-president img');

    if (bureau.presidentNom) nomEls.forEach(el => el.textContent = bureau.presidentNom);
    if (bureau.presidentTitre) titreEls.forEach(el => el.textContent = bureau.presidentTitre);
    if (bureau.presidentMandat) mandatEls.forEach(el => el.textContent = bureau.presidentMandat);
    if (bureau.presidentMot) motEls.forEach(el => el.textContent = bureau.presidentMot);
    if (bureau.presidentPhoto) photoEls.forEach(el => el.src = bureau.presidentPhoto);

  } catch (e) {
    console.warn("Mise à jour dynamique de la présidence ignorée.");
  }
}

// 2. Synchronisation Dynamique des Événements & Actualités
function synchroniserActualitesPublic() {
  const actualitesRaw = localStorage.getItem('aeemci_cms_actualites');
  if (!actualitesRaw) return;

  try {
    const actualites = JSON.parse(actualitesRaw);
    const container = document.getElementById('container-actualites') || document.getElementById('publicNewsContainer') || document.querySelector('.grille-actualites');

    if (container && actualites && actualites.length > 0) {
      container.innerHTML = '';
      actualites.forEach(actu => {
        const article = document.createElement('article');
        article.className = 'carte-actualite-moderne';
        article.innerHTML = `
          <div class="carte-actu-image">
            <img src="${actu.image || 'images/logo.png'}" alt="${actu.titre}" loading="lazy" onerror="this.src='images/logo.png';">
            <span class="badge-categorie">${actu.categorie}</span>
          </div>
          <div class="carte-actu-contenu">
            <div class="méta-actu">
              <span>📅 ${actu.date}</span>
              <span>📍 ${actu.lieu}</span>
            </div>
            <h3>${actu.titre}</h3>
            <p>${actu.description}</p>
          </div>
        `;
        container.appendChild(article);
      });
    }
  } catch (e) {
    console.warn("Mise à jour des actualités ignorée.");
  }
}

// 3. Synchronisation Dynamique des Modules de Formation
function synchroniserFormationsPublic() {
  const formationsRaw = localStorage.getItem('aeemci_cms_formations');
  if (!formationsRaw) return;

  try {
    const formations = JSON.parse(formationsRaw);
    const container = document.getElementById('container-formations') || document.getElementById('publicFormationsContainer') || document.querySelector('.grille-formations');

    if (container && formations && formations.length > 0) {
      container.innerHTML = '';
      formations.forEach(f => {
        const item = document.createElement('div');
        item.className = 'carte-formation-item';
        item.style.cssText = "border: 1px solid var(--bordure-carte); border-radius: 16px; padding: 24px; background: #FFFFFF; box-shadow: var(--ombre-carte); display: flex; flex-direction: column; justify-content: space-between;";
        item.innerHTML = `
          <div>
            <span class="badge-tag or" style="margin-bottom: 10px; display: inline-block;">Module Officiel</span>
            <h3 style="font-size: 1.2rem; color: var(--vert-emeraude); font-weight: 800; margin-bottom: 8px;">${f.intitule}</h3>
            <p style="font-size: 0.9rem; color: var(--texte-doux); line-height: 1.6; margin-bottom: 16px;">${f.description}</p>
          </div>
          <div>
            <a href="${f.lien || 'https://wa.me/2250545305180'}" target="_blank" class="bouton-action-contour" style="width: 100%; justify-content: center; font-weight: 700;">
              Réserver ma place sur WhatsApp →
            </a>
          </div>
        `;
        container.appendChild(item);
      });
    }
  } catch (e) {
    console.warn("Mise à jour des formations ignorée.");
  }
}

// 4. Synchronisation des Compteurs Statistiques
function synchroniserStatistiquesPublic() {
  const militantsRaw = localStorage.getItem('aeemci_militants_db');
  if (!militantsRaw) return;

  try {
    const militants = JSON.parse(militantsRaw);
    const totalValides = militants.filter(m => m.statut === 'valide').length || militants.length;

    const statMilitants = document.getElementById('publicStatMilitants') || document.querySelector('.carte-chiffre-cle:nth-child(1) .chiffre-cle');
    if (statMilitants && totalValides > 0) {
      statMilitants.textContent = totalValides + '+';
    }
  } catch (e) {
    console.warn("Mise à jour des statistiques ignorée.");
  }
}

// 5. Synchronisation des Photos de la Galerie Uploadées depuis le Studio
function synchroniserGaleriePublic() {
  const galerieRaw = localStorage.getItem('aeemci_cms_galerie');
  if (!galerieRaw) return;

  try {
    const mefGalerie = JSON.parse(galerieRaw);
    const container = document.getElementById('container-galerie') || document.querySelector('.grille-galerie-filtree');

    if (container && mefGalerie && mefGalerie.length > 0) {
      const photosValides = mefGalerie.filter(item => item && item.url && !item.url.includes('../images/'));
      
      photosValides.reverse().forEach(photo => {
        const item = document.createElement('div');
        item.className = 'carte-galerie-item';
        item.innerHTML = `
          <img src="${photo.url}" alt="${photo.titre || 'Photo AEEMCI Koumassi'}" loading="lazy" onerror="this.src='images/logo.png';">
          <div class="carte-galerie-overlay">
            <span class="carte-galerie-cat">Nouveau • Studio Admin</span>
            <h3 class="carte-galerie-titre">${photo.titre || 'Activité Koumassi'}</h3>
          </div>
        `;
        container.insertBefore(item, container.firstChild);
      });
    }
  } catch (e) {
    console.warn("Mise à jour de la galerie ignorée.");
  }
}

// 6. Synchronisation des Coordonnées Officielles & Footer
function synchroniserContactPublic() {
  const contactRaw = localStorage.getItem('aeemci_cms_contact');
  if (!contactRaw) return;

  try {
    const contact = JSON.parse(contactRaw);

    const adresseEls = document.querySelectorAll('#site-contact-adresse, #publicFooterAdresse, .contact-adresse-txt');
    const tel1Els = document.querySelectorAll('#site-contact-phone, #publicFooterTel, .contact-tel-txt');
    const emailEls = document.querySelectorAll('#site-contact-email, #publicFooterEmail, .contact-email-txt');
    const horairesEls = document.querySelectorAll('#site-contact-horaires, #publicFooterHoraires, .contact-horaires-txt');
    const whatsappLinks = document.querySelectorAll('#site-contact-whatsapp, #publicSocialWhatsapp, a.btn-join-whatsapp');

    adresseEls.forEach(el => el.textContent = contact.adresse || 'Koumassi, Abidjan');
    tel1Els.forEach(el => el.textContent = (contact.tel1 ? contact.tel1 : '') + (contact.tel2 ? ' / ' + contact.tel2 : ''));
    emailEls.forEach(el => el.textContent = contact.email || 'aeemci.koumassi@gmail.com');
    horairesEls.forEach(el => el.textContent = contact.horaires || 'Chaque Samedi à 15H00');
    if (contact.whatsappLink) {
      whatsappLinks.forEach(a => a.href = contact.whatsappLink);
    }
  } catch (e) {
    console.warn("Mise à jour des coordonnées du footer ignorée.");
  }
}
