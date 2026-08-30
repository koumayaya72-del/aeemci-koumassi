/* ==========================================================================
   SITE PUBLIC AEEMCI KOUMASSI — SCRIPT DE SYNCHRONISATION DYNAMIQUE (MAIN.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  lancerSynchronisationGlobale();
  initialiserAnimationsScroll();
  initialiserCompteursChiffres();
});


// Écouteurs d'événements temps réel pour mise à jour instantanée sans rechargement de page
window.addEventListener('storage', function() {
  lancerSynchronisationGlobale();
});

window.addEventListener('focus', function() {
  lancerSynchronisationGlobale();
});

// Gestion du cache pour éviter les appels API excessifs
const CMS_CACHE = {
  lastFetch: 0,
  ttl: 5 * 60 * 1000, // 5 minutes
  isExpired: function() {
    return Date.now() - this.lastFetch > this.ttl;
  },
  updateTimestamp: function() {
    this.lastFetch = Date.now();
  }
};

async function lancerSynchronisationGlobale() {
  if (!CMS_CACHE.isExpired()) {
    console.log("Données CMS encore fraîches, synchronisation légère...");
    // On synchronise quand même les stats qui peuvent changer souvent
    await synchroniserStatistiquesPublic();
    return;
  }

  await synchroniserBureauPublic();
  await synchroniserActualitesPublic();
  await synchroniserFormationsPublic();
  await synchroniserStatistiquesPublic();
  await synchroniserGaleriePublic();
  await synchroniserContactPublic();
  CMS_CACHE.updateTimestamp();
}

// 1. Synchronisation de la Présidence & Mot du Président
async function synchroniserBureauPublic() {
  let bureau = await window.cmsRead.fetchSection('bureau');
  if (!bureau) {
    const bureauRaw = localStorage.getItem('aeemci_cms_bureau');
    if (!bureauRaw) return;
    try { bureau = JSON.parse(bureauRaw); } catch(e) {}
  }
  if (!bureau) return;

  try {

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
async function synchroniserActualitesPublic() {
  let actualites = await window.cmsRead.fetchSection('actualites');
  const cmsRaw = localStorage.getItem('aeemci_cms_actualites');
  const customRaw = localStorage.getItem('aeemci_evenements_custom');

  if (!actualites) {
    try { if (cmsRaw) actualites = JSON.parse(cmsRaw); } catch(e){}
  }
  if (!actualites) actualites = [];

  try {
    if (customRaw) {
      const customList = JSON.parse(customRaw);
      customList.forEach(c => {
        if (!actualites.some(a => a.titre === c.titre)) {
          actualites.unshift({
            id: Date.now(),
            titre: c.titre,
            categorie: c.badge || 'ÉVÉNEMENT',
            date: c.date || 'Prochainement',
            lieu: c.lieu || 'Koumassi',
            description: c.desc || c.description,
            image: c.image || 'images/maouloud.jpg'
          });
        }
      });
    }
  } catch(e){}

  const prochainActu = actualites.find(a => (a.categorie && a.categorie.toUpperCase().includes('PROCHAIN')) || (a.badge && a.badge.toUpperCase().includes('PROCHAIN')));
  if (prochainActu) {
    const heroImg = document.getElementById('hero-actu-image');
    const heroTitre = document.getElementById('hero-actu-titre');
    const heroTheme = document.getElementById('hero-actu-theme');
    const heroDetails = document.getElementById('hero-actu-details');

    if (heroImg && prochainActu.image) heroImg.src = prochainActu.image;
    if (heroTitre && prochainActu.titre) heroTitre.textContent = prochainActu.titre;
    if (heroTheme && prochainActu.description) heroTheme.textContent = "Thème : « " + prochainActu.description + " »";
    if (heroDetails) heroDetails.textContent = `📍 ${prochainActu.lieu || 'Koumassi'} • ${prochainActu.date || 'Prochainement'}`;
  }

  const container = document.getElementById('container-actualites') || document.getElementById('publicNewsContainer') || document.querySelector('.grille-actualites-cartes');

  if (container && actualites.length > 0) {
    container.innerHTML = '';
    actualites.forEach(actu => {
      const article = document.createElement('article');
      article.className = 'carte-actualite-moderne';
      article.innerHTML = `
        <div class="carte-actu-image">
          <span class="carte-actu-badge or">${actu.categorie || 'ÉVÉNEMENT'}</span>
          <img src="${actu.image || 'images/logo.png'}" alt="${actu.titre}" loading="lazy" onerror="this.src='images/logo.png';">
        </div>
        <div class="carte-actu-corps">
          <span class="carte-actu-date">📅 ${actu.date} ${actu.lieu ? '• 📍 ' + actu.lieu : ''}</span>
          <h3 class="carte-actu-titre">${actu.titre}</h3>
          <p class="carte-actu-desc">${actu.description}</p>
        </div>
      `;
      container.appendChild(article);
    });
  }
}

// 3. Synchronisation Dynamique des Modules de Formation
async function synchroniserFormationsPublic() {
  let formations = await window.cmsRead.fetchSection('formations');
  const formationsRaw = localStorage.getItem('aeemci_cms_formations');
  if (!formations) {
    try { if (formationsRaw) formations = JSON.parse(formationsRaw); } catch(e){}
  }
  if (!formations) return;

  try {
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
async function synchroniserStatistiquesPublic() {
  let militants = await window.cmsRead.fetchMilitants();
  if (!militants) {
    const militantsRaw = localStorage.getItem('aeemci_militants_db');
    try { if (militantsRaw) militants = JSON.parse(militantsRaw); } catch(e){}
  }
  if (!militants) return;

  try {
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
async function synchroniserGaleriePublic() {
  let listCMS = await window.cmsRead.fetchSection('galerie');
  const cmsRaw = localStorage.getItem('aeemci_cms_galerie');
  const customRaw = localStorage.getItem('aeemci_galerie_custom');

  if (!listCMS) {
    try { if (cmsRaw) listCMS = JSON.parse(cmsRaw); } catch(e){}
  }
  if (!listCMS) listCMS = [];
  let listCustom = [];
  try { if (customRaw) listCustom = JSON.parse(customRaw); } catch(e){}
  
  const combinees = [...listCMS];
  listCustom.forEach(c => {
    const url = c.photo || c.url;
    if (url && !combinees.some(item => (item.url || item.photo) === url)) {
      combinees.push({ id: Date.now() + Math.random(), url: url, titre: c.titre || 'Photo Studio' });
    }
  });

  const container = document.getElementById('container-galerie') || document.querySelector('.grille-galerie-filtree');

  if (container && combinees.length > 0) {
    container.querySelectorAll('.carte-galerie-dynamique-studio').forEach(el => el.remove());

    const photosValides = combinees.filter(item => item && (item.url || item.photo) && !(item.url || item.photo).includes('../images/'));

    [...photosValides].reverse().forEach(photo => {
      const src = photo.url || photo.photo;
      const item = document.createElement('div');
      item.className = 'carte-galerie-item carte-galerie-dynamique-studio';
      item.innerHTML = `
        <img src="${src}" alt="${photo.titre || 'Photo AEEMCI Koumassi'}" loading="lazy" onerror="this.src='images/logo.png';">
        <div class="carte-galerie-overlay">
          <span class="carte-galerie-cat">Nouveau • Studio Admin</span>
          <h3 class="carte-galerie-titre">${photo.titre || 'Activité Koumassi'}</h3>
        </div>
      `;
      container.insertBefore(item, container.firstChild);
    });
  }
}

// 6. Synchronisation des Coordonnées Officielles & Footer
async function synchroniserContactPublic() {
  let contact = await window.cmsRead.fetchSection('contact');
  const contactRaw = localStorage.getItem('aeemci_cms_contact');
  if (!contact) {
    try { if (contactRaw) contact = JSON.parse(contactRaw); } catch(e){}
  }
  if (!contact) return;

  try {

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

// 7. Initialisation des Animations de Révélation au Défilement (Premium Polish)
function initialiserAnimationsScroll() {
  const observerOptions = {
    threshold: 0.15 // Déclenche quand 15% de l'élément est visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section, .carte-pilier-moderne, .etape-carte').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// 8. Animation dynamique de comptage pour les Chiffres Clés (Impact)
function initialiserCompteursChiffres() {
  const elements = document.querySelectorAll('.nombre-chiffre-cle[data-compteur]');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animerCompteur(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
}

function animerCompteur(el) {
  const cible = parseInt(el.getAttribute('data-compteur')) || 0;
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  let depart = 0;
  const duree = 1500;
  const pasTemps = 20;
  const etapes = duree / pasTemps;
  const increment = cible / etapes;

  const timer = setInterval(() => {
    depart += increment;
    if (depart >= cible) {
      el.textContent = `${prefix}${cible}${suffix}`;
      clearInterval(timer);
    } else {
      el.textContent = `${prefix}${Math.floor(depart)}${suffix}`;
    }
  }, pasTemps);
}
