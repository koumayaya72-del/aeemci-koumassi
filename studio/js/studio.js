/* ==========================================================================
   STUDIO AEEMCI KOUMASSI — LOGIQUE DASHBOARD ADMIN & DYNAMISATION CRUD
   ========================================================================== */

let militantsData = [];

document.addEventListener('DOMContentLoaded', async function() {
  await chargerMilitantsDepuisBase();
});

async function chargerMilitantsDepuisBase() {
  if (window.militantsDb && typeof window.militantsDb.fetchMilitants === 'function') {
    militantsData = await window.militantsDb.fetchMilitants();
  } else {
    militantsData = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
  }

  if (!militantsData || militantsData.length === 0) {
    militantsData = [
      { id: 1, nom: "Kouamé Ibrahim", quartier: "Koumassi Prodomo", ecole: "Lycée Moderne de Koumassi", telephone: "0757477372", statut: "valide", date: "2026-08-20" },
      { id: 2, nom: "Diallo Mariam", quartier: "Koumassi Remblais", ecole: "Université Felix Houphouët-Boigny", telephone: "0545305180", statut: "valide", date: "2026-08-21" },
      { id: 3, nom: "Traoré Abdoulaye", quartier: "Koumassi Sicogi", ecole: "Collège Moderne La Colombe", telephone: "0102030405", statut: "attente", date: "2026-08-24" },
      { id: 4, nom: "Zeba Samira", quartier: "Koumassi Sopim", ecole: "IST-ISG La Colombe", telephone: "0708091011", statut: "valide", date: "2026-08-25" },
      { id: 5, nom: "Sow Mohamed", quartier: "Koumassi Camp Commando", ecole: "INPHB Yamoussoukro", telephone: "0506070809", statut: "valide", date: "2026-08-26" }
    ];
    localStorage.setItem('aeemci_militants_db', JSON.stringify(militantsData));
  }

  afficherMilitantsTable(militantsData);
  mettreAJourKpi();
}

function changerOngletStudio(ongletId, element) {
  const onglets = document.querySelectorAll('.onglet-contenu');
  onglets.forEach(o => o.classList.remove('actif'));

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(n => n.classList.remove('actif'));

  const cible = document.getElementById(ongletId);
  if (cible) cible.classList.add('actif');
  if (element) element.classList.add('actif');
}

function toggleSidebarStudio() {
  const sidebar = document.getElementById('studioSidebar');
  if (sidebar) {
    sidebar.classList.toggle('retractee');
  }
}

function afficherMilitantsTable(liste) {
  const tbody1 = document.getElementById('tbodyMilitants');
  const tbody2 = document.getElementById('tbodyMilitantsComplet');

  const genererHtml = (data) => {
    if (!data || data.length === 0) {
      return `<tr><td colspan="6" style="text-align: center; color: var(--texte-muet); padding: 30px;">Aucun militant trouvé.</td></tr>`;
    }
    return data.map(m => {
      let badgeClass = m.statut === 'valide' ? 'valide' : (m.statut === 'rejete' ? 'rejete' : 'attente');
      let badgeText = m.statut === 'valide' ? 'Validé' : (m.statut === 'rejete' ? 'Rejeté' : 'En attente');
      return `
        <tr>
          <td><strong>${m.nom}</strong></td>
          <td>${m.quartier || 'Koumassi'}</td>
          <td>${m.ecole || 'Établissement non renseigné'}</td>
          <td>
            <a href="https://wa.me/225${m.telephone}?text=Assalamu%20alaykum%20${encodeURIComponent(m.nom)},%20votre%20demande%20d'adh%C3%A9sion%20%C3%A0%20l'AEEMCI%20Koumassi%20a%20%C3%A9t%C3%A9%20trait%C3%A9e%20avec%20succ%C3%A8s !" target="_blank" class="bouton-whatsapp">
              💬 ${m.telephone}
            </a>
          </td>
          <td><span class="badge-statut ${badgeClass}">${badgeText}</span></td>
          <td>
            <button class="bouton-table-action" onclick="validerMilitant(${m.id})" title="Valider">✅</button>
            <button class="bouton-table-action" onclick="supprimerMilitant(${m.id})" title="Supprimer">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');
  };

  const html = genererHtml(liste);
  if (tbody1) tbody1.innerHTML = html;
  if (tbody2) tbody2.innerHTML = html;
}

function filtrerMilitants() {
  const inputElem = document.getElementById('inputRechercheMilitant') || document.getElementById('inputRechercheTop');
  const recherche = inputElem ? inputElem.value.toLowerCase() : '';
  const selectElem = document.getElementById('selectFiltreStatut');
  const filtreStatut = selectElem ? selectElem.value : 'tous';

  const resultats = militantsData.filter(m => {
    const correspondNom = m.nom.toLowerCase().includes(recherche) || (m.quartier && m.quartier.toLowerCase().includes(recherche)) || (m.telephone && m.telephone.includes(recherche));
    const correspondStatut = (filtreStatut === 'tous') || (m.statut === filtreStatut);
    return correspondNom && correspondStatut;
  });

  afficherMilitantsTable(resultats);
}

async function validerMilitant(id) {
  if (window.militantsDb && typeof window.militantsDb.updateStatus === 'function') {
    await window.militantsDb.updateStatus(id, 'valide');
  }
  const item = militantsData.find(m => m.id === id);
  if (item) item.statut = 'valide';

  filtrerMilitants();
  mettreAJourKpi();
  alert(`La demande du militant a été validée avec succès !`);
}

async function supprimerMilitant(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette demande d'adhésion ?")) {
    if (window.militantsDb && typeof window.militantsDb.deleteMilitant === 'function') {
      await window.militantsDb.deleteMilitant(id);
    }
    militantsData = militantsData.filter(m => m.id !== id);

    filtrerMilitants();
    mettreAJourKpi();
  }
}

function ouvrirModalAjoutMilitant() {
  const m = document.getElementById('modalAjoutMilitant');
  if (m) m.classList.add('active');
}

function fermerModalAjoutMilitant() {
  const m = document.getElementById('modalAjoutMilitant');
  if (m) m.classList.remove('active');
}

async function enregistrerNouveauMilitant(e) {
  e.preventDefault();
  const nom = document.getElementById('nomMilitant').value.trim();
  const quartier = document.getElementById('quartierMilitant').value.trim();
  const ecole = document.getElementById('ecoleMilitant').value.trim();
  const telephone = document.getElementById('telMilitant').value.trim();

  if (!nom || !telephone) {
    alert("Veuillez remplir au moins le nom et le numéro de téléphone.");
    return;
  }

  const nouveauData = {
    nom: nom,
    quartier: quartier || "Koumassi",
    ecole: ecole || "Non spécifié",
    telephone: telephone,
    statut: "valide"
  };

  let enregistre = null;
  if (window.militantsDb && typeof window.militantsDb.insertMilitant === 'function') {
    enregistre = await window.militantsDb.insertMilitant(nouveauData);
  } else {
    enregistre = { id: Date.now(), ...nouveauData, date: new Date().toISOString().split('T')[0] };
    militantsData.unshift(enregistre);
    localStorage.setItem('aeemci_militants_db', JSON.stringify(militantsData));
  }

  await chargerMilitantsDepuisBase();
  fermerModalAjoutMilitant();
  alert(`Le militant ${nom} a été inscrit avec succès !`);
}

function exporterMilitantsCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Nom,Quartier,Etablissement,Telephone,Statut,Date\n";
  militantsData.forEach(m => {
    csvContent += `"${m.nom}","${m.quartier || ''}","${m.ecole || ''}","${m.telephone || ''}","${m.statut || ''}","${m.date || ''}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `AEEMCI_Koumassi_Militants_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function mettreAJourKpi() {
  const totalValides = militantsData.filter(m => m.statut === 'valide').length;
  const totalAttentes = militantsData.filter(m => m.statut === 'attente').length;

  const totalEl = document.getElementById('kpiTotalMilitants');
  const attentesEl = document.getElementById('kpiAttentes');

  if (totalEl) totalEl.textContent = totalValides || militantsData.length;
  if (attentesEl) attentesEl.textContent = totalAttentes;
}

window.chargerMilitantsDepuisBase = chargerMilitantsDepuisBase;
window.changerOngletStudio = changerOngletStudio;
window.toggleSidebarStudio = toggleSidebarStudio;
window.filtrerMilitants = filtrerMilitants;
