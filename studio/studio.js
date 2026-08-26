/* ==========================================================================
   STUDIO AEEMCI KOUMASSI — LOGIQUE DASHBOARD ADMIN & CRUD (ES6+)
   ========================================================================== */

// Base de données locale de démonstration (Prête pour connexion Supabase / Firebase)
let militantsData = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [
  { id: 1, nom: "Kouamé Ibrahim", quartier: "Koumassi Prodomo", ecole: "Lycée Moderne de Koumassi", telephone: "0757477372", statut: "valide", date: "2026-08-20" },
  { id: 2, nom: "Diallo Mariam", quartier: "Koumassi Remblais", ecole: "Université Felix Houphouët-Boigny", telephone: "0545305180", statut: "valide", date: "2026-08-21" },
  { id: 3, nom: "Traoré Abdoulaye", quartier: "Koumassi Sicogi", ecole: "Collège Moderne La Colombe", telephone: "0102030405", statut: "attente", date: "2026-08-24" },
  { id: 4, nom: "Zeba Samira", quartier: "Koumassi Sopim", ecole: "IST-ISG La Colombe", telephone: "0708091011", statut: "valide", date: "2026-08-25" },
  { id: 5, nom: "Sow Mohamed", quartier: "Koumassi Camp Commando", ecole: "INPHB Yamoussoukro", telephone: "0506070809", statut: "valide", date: "2026-08-26" }
];

document.addEventListener('DOMContentLoaded', function() {
  afficherMilitantsTable(militantsData);
  mettreAJourKpi();
});

// 1. Changement d'Onglet (Navigation Sidebar)
function changerOngletStudio(ongletId, element) {
  // Masquer tous les onglets
  const onglets = document.querySelectorAll('.onglet-contenu');
  onglets.forEach(o => o.classList.remove('actif'));

  // Retirer l'état actif de la nav
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(n => n.classList.remove('actif'));

  // Activer l'onglet cible
  const cible = document.getElementById(ongletId);
  if (cible) cible.classList.add('actif');
  if (element) element.classList.add('actif');
}

// 2. Barre Latérale Rétractable
function toggleSidebarStudio() {
  const sidebar = document.getElementById('studioSidebar');
  if (sidebar) {
    sidebar.classList.toggle('retractee');
  }
}

// 3. Affichage du Tableau des Militants
function afficherMilitantsTable(liste) {
  const tbody = document.getElementById('tbodyMilitants');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (liste.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--texte-muet); padding: 30px;">Aucun militant trouvé.</td></tr>`;
    return;
  }

  liste.forEach(m => {
    let badgeClass = 'attente';
    let badgeText = 'En attente';

    if (m.statut === 'valide') {
      badgeClass = 'valide';
      badgeText = 'Validé';
    } else if (m.statut === 'rejete') {
      badgeClass = 'rejete';
      badgeText = 'Rejeté';
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${m.nom}</strong></td>
      <td>${m.quartier}</td>
      <td>${m.ecole}</td>
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
    `;
    tbody.appendChild(tr);
  });
}

// 4. Filtrage & Recherche Instantanée
function filtrerMilitants() {
  const recherche = document.getElementById('inputRechercheMilitant').value.toLowerCase();
  const filtreStatut = document.getElementById('selectFiltreStatut').value;

  const resultats = militantsData.filter(m => {
    const correspondNom = m.nom.toLowerCase().includes(recherche) || m.quartier.toLowerCase().includes(recherche) || m.telephone.includes(recherche);
    const correspondStatut = (filtreStatut === 'tous') || (m.statut === filtreStatut);
    return correspondNom && correspondStatut;
  });

  afficherMilitantsTable(resultats);
}

// 5. Validation d'un Militant (CRUD Update)
function validerMilitant(id) {
  const m = militantsData.find(item => item.id === id);
  if (m) {
    m.statut = 'valide';
    sauvegarderLocal();
    filtrerMilitants();
    mettreAJourKpi();
    alert(`Le militant ${m.nom} a été validé avec succès !`);
  }
}

// 6. Suppression d'un Militant (CRUD Delete)
function supprimerMilitant(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette demande d'adhésion ?")) {
    militantsData = militantsData.filter(m => m.id !== id);
    sauvegarderLocal();
    filtrerMilitants();
    mettreAJourKpi();
  }
}

// 7. Modale Ajouter un Militant (CRUD Create)
function ouvrirModalAjoutMilitant() {
  document.getElementById('modalAjoutMilitant').classList.add('active');
}

function fermerModalAjoutMilitant() {
  document.getElementById('modalAjoutMilitant').classList.remove('active');
}

function enregistrerNouveauMilitant(e) {
  e.preventDefault();
  const nom = document.getElementById('nomMilitant').value.trim();
  const quartier = document.getElementById('quartierMilitant').value.trim();
  const ecole = document.getElementById('ecoleMilitant').value.trim();
  const telephone = document.getElementById('telMilitant').value.trim();

  if (!nom || !telephone) {
    alert("Veuillez remplir au moins le nom et le numéro de téléphone.");
    return;
  }

  const nouveau = {
    id: Date.now(),
    nom: nom,
    quartier: quartier || "Koumassi",
    ecole: ecole || "Non spécifié",
    telephone: telephone,
    statut: "valide",
    date: new Date().toISOString().split('T')[0]
  };

  militantsData.unshift(nouveau);
  sauvegarderLocal();
  filtrerMilitants();
  mettreAJourKpi();
  fermerModalAjoutMilitant();
  alert(`Le militant ${nom} a été ajouté avec succès !`);
}

// 8. Export des Données (CSV / Excel)
function exporterMilitantsCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Nom,Quartier,Etablissement,Telephone,Statut,Date\n";
  militantsData.forEach(m => {
    csvContent += `"${m.nom}","${m.quartier}","${m.ecole}","${m.telephone}","${m.statut}","${m.date}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `AEEMCI_Koumassi_Militants_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 9. Mise à Jour des KPI du Dashboard
function mettreAJourKpi() {
  const total = militantsData.length;
  const valides = militantsData.filter(m => m.statut === 'valide').length;
  const attentes = militantsData.filter(m => m.statut === 'attente').length;

  const totalEl = document.getElementById('kpiTotalMilitants');
  const attentesEl = document.getElementById('kpiAttentes');

  if (totalEl) totalEl.textContent = valides;
  if (attentesEl) attentesEl.textContent = attentes;
}

// 10. Helper LocalStorage
function sauvegarderLocal() {
  localStorage.setItem('aeemci_militants_db', JSON.stringify(militantsData));
}

// Export global pour la window
window.changerOngletStudio = changerOngletStudio;
window.toggleSidebarStudio = toggleSidebarStudio;
window.filtrerMilitants = filtrerMilitants;
window.validerMilitant = validerMilitant;
window.supprimerMilitant = supprimerMilitant;
window.ouvrirModalAjoutMilitant = ouvrirModalAjoutMilitant;
window.fermerModalAjoutMilitant = fermerModalAjoutMilitant;
window.enregistrerNouveauMilitant = enregistrerNouveauMilitant;
window.exporterMilitantsCSV = exporterMilitantsCSV;
