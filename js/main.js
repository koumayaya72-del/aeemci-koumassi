/* ==========================================================================
   SITE PUBLIC AEEMCI KOUMASSI — SCRIPT DE SYNCHRONISATION DYNAMIQUE (MAIN.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  synchroniserBureauPublic();
  synchroniserActualitesPublic();
  synchroniserStatistiquesPublic();
  synchroniserGaleriePublic();
  synchroniserContactPublic();
});

// 1. Synchronisation des Infos du Bureau & Photo du Président
function synchroniserBureauPublic() {
  const bureauRaw = localStorage.getItem('aeemci_cms_bureau');
  if (!bureauRaw) return;

  try {
    const bureau = JSON.parse(bureauRaw);

    const nomEl = document.getElementById('publicPresidentNom') || document.querySelector('.carte-president .nom-president');
    const motEl = document.getElementById('publicPresidentMot') || document.querySelector('.mot-du-president p');
    const photoEl = document.getElementById('publicPresidentPhoto') || document.querySelector('.carte-president img');

    if (nomEl && bureau.presidentNom) nomEl.textContent = bureau.presidentNom;
    if (motEl && bureau.presidentMot) motEl.textContent = bureau.presidentMot;
    if (photoEl && bureau.presidentPhoto) photoEl.src = bureau.presidentPhoto;

  } catch (e) {
    console.warn("Mise à jour dynamique du bureau ignorée.");
  }
}

// 2. Synchronisation Dynamique des Événements & Actualités du Studio Admin
function synchroniserActualitesPublic() {
  const actualitesRaw = localStorage.getItem('aeemci_cms_actualites');
  if (!actualitesRaw) return;

  try {
    const actualites = JSON.parse(actualitesRaw);
    const container = document.getElementById('publicNewsContainer') || document.querySelector('.grille-actualites');

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

// 3. Synchronisation Dynamique des Compteurs Statistiques sur la Page d'Accueil
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

// 4. Synchronisation Dynamique des Photos de la Galerie Uploadées depuis le Studio
function synchroniserGaleriePublic() {
  const galerieRaw = localStorage.getItem('aeemci_cms_galerie');
  if (!galerieRaw) return;

  try {
    const mefGalerie = JSON.parse(galerieRaw);
    const container = document.querySelector('.grille-galerie-filtree');

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

// 5. Synchronisation Dynamique des Coordonnées & Réseaux Sociaux du Footer sur Tout le Site
function synchroniserContactPublic() {
  const contactRaw = localStorage.getItem('aeemci_cms_contact');
  if (!contactRaw) return;

  try {
    const contact = JSON.parse(contactRaw);

    const adresseEls = document.querySelectorAll('#publicFooterAdresse, .contact-adresse-txt');
    const tel1Els = document.querySelectorAll('#publicFooterTel, .contact-tel-txt');
    const emailEls = document.querySelectorAll('#publicFooterEmail, .contact-email-txt');
    const horairesEls = document.querySelectorAll('#publicFooterHoraires, .contact-horaires-txt');
    const whatsappLinks = document.querySelectorAll('#publicSocialWhatsapp, a.btn-join-whatsapp');

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
