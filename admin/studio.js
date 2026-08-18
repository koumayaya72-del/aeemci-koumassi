// AEEMCI Koumassi Studio — Full 100% Site Editor Logic & Robust Image Manager
(function() {
  const PIN_CORRECT = "2026";
  
  if (sessionStorage.getItem("aeemci_studio_auth") === "true") {
    document.getElementById("pinLockOverlay").style.display = "none";
    window.addEventListener("DOMContentLoaded", function() {
      initialiserStudio();
    });
  }

  window.verifierPin = function() {
    const pinInput = document.getElementById("pinInput").value;
    if (pinInput === PIN_CORRECT) {
      sessionStorage.setItem("aeemci_studio_auth", "true");
      document.getElementById("pinLockOverlay").style.display = "none";
      initialiserStudio();
    } else {
      alert("Code PIN incorrect. Réessayez avec 2026.");
      document.getElementById("pinInput").value = "";
    }
  };

  function initialiserStudio() {
    chargerTableEvenements();
    chargerTableBureau();
    chargerTableGalerie();
    chargerChampsEditeurGlobal();
    rafraichirStatsDashboard();
  }

  // Normalisation des chemins d'images (pour affichage sans erreur en admin et sur le site public)
  function normaliserCheminAdmin(path) {
    if (!path) return "../images/logo.png";
    if (path.startsWith("data:image/") || path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    if (path.startsWith("../")) return path;
    return "../" + path;
  }

  window.changerOnglet = function(tabName, element) {
    document.querySelectorAll(".studio-nav-item").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".studio-tab-content").forEach(tab => tab.classList.remove("active"));
    
    element.classList.add("active");
    document.getElementById("tab-" + tabName).classList.add("active");
    document.getElementById("studioPageTitle").textContent = element.textContent.trim();
  };

  /* =========================================================
     1. ÉDITEUR GLOBAL 100% (HERO, IMPACT, CONTACTS, SLOGANS)
     ========================================================= */
  function chargerChampsEditeurGlobal() {
    var siteData = JSON.parse(localStorage.getItem("aeemci_site_config_full") || "{}");

    if (document.getElementById("editHeroTitre")) {
      document.getElementById("editHeroTitre").value = siteData.heroTitre || "Sous-Comité AEEMCI Koumassi";
      document.getElementById("editHeroSousTitre").value = siteData.heroSousTitre || "Formation • Leadership • Foi & Excellence académique pour la jeunesse musulmane de Koumassi.";
      document.getElementById("editHeroBadge").value = siteData.heroBadge || "SECTEUR ABIDJAN-SUD — COMMUNE DE KOUMASSI";

      // Impact 4 Cartes
      document.getElementById("editImpact1Chiffre").value = siteData.impact1Chiffre || "+20";
      document.getElementById("editImpact1Titre").value = siteData.impact1Titre || "Sections Actives";
      document.getElementById("editImpact1Desc").value = siteData.impact1Desc || "Établissements secondaires et supérieurs encadrés à Koumassi.";

      document.getElementById("editImpact2Chiffre").value = siteData.impact2Chiffre || "+500";
      document.getElementById("editImpact2Titre").value = siteData.impact2Titre || "Militants Encadrés";
      document.getElementById("editImpact2Desc").value = siteData.impact2Desc || "Élèves et étudiants suivis et formés chaque année.";

      document.getElementById("editImpact3Chiffre").value = siteData.impact3Chiffre || "95%";
      document.getElementById("editImpact3Titre").value = siteData.impact3Titre || "Taux de Réussite";
      document.getElementById("editImpact3Desc").value = siteData.impact3Desc || "Succès aux examens officiels (BEPC, BAC) des membres suivis.";

      document.getElementById("editImpact4Chiffre").value = siteData.impact4Chiffre || "+50 Ans";
      document.getElementById("editImpact4Titre").value = siteData.impact4Titre || "D'Engagement & d'Histoire";
      document.getElementById("editImpact4Desc").value = siteData.impact4Desc || "Plus d'un demi-siècle de leadership (Fondée en 1975, agréée en 1979).";

      // Contacts & Réunion
      document.getElementById("editTelPresident").value = siteData.telPresident || "+225 05 45 30 51 80";
      document.getElementById("editTelSecGen").value = siteData.telSecGen || "+225 07 57 47 73 72";
      document.getElementById("editLieuReunion").value = siteData.lieuReunion || "Chaque Samedi à l'IST-ISG La Colombe (Koumassi)";
      document.getElementById("editLienWhatsapp").value = siteData.lienWhatsapp || "https://chat.whatsapp.com/KUd1Zmc2JEfBsIWdH5HPdm";
    }
  }

  window.sauvegarderConfigurationFull = function(e) {
    if(e) e.preventDefault();
    
    var siteData = {
      heroTitre: document.getElementById("editHeroTitre").value,
      heroSousTitre: document.getElementById("editHeroSousTitre").value,
      heroBadge: document.getElementById("editHeroBadge").value,

      impact1Chiffre: document.getElementById("editImpact1Chiffre").value,
      impact1Titre: document.getElementById("editImpact1Titre").value,
      impact1Desc: document.getElementById("editImpact1Desc").value,

      impact2Chiffre: document.getElementById("editImpact2Chiffre").value,
      impact2Titre: document.getElementById("editImpact2Titre").value,
      impact2Desc: document.getElementById("editImpact2Desc").value,

      impact3Chiffre: document.getElementById("editImpact3Chiffre").value,
      impact3Titre: document.getElementById("editImpact3Titre").value,
      impact3Desc: document.getElementById("editImpact3Desc").value,

      impact4Chiffre: document.getElementById("editImpact4Chiffre").value,
      impact4Titre: document.getElementById("editImpact4Titre").value,
      impact4Desc: document.getElementById("editImpact4Desc").value,

      telPresident: document.getElementById("editTelPresident").value,
      telSecGen: document.getElementById("editTelSecGen").value,
      lieuReunion: document.getElementById("editLieuReunion").value,
      lienWhatsapp: document.getElementById("editLienWhatsapp").value
    };

    localStorage.setItem("aeemci_site_config_full", JSON.stringify(siteData));
    alert("✅ TOUTES les modifications de votre site ont été enregistrées avec succès et publiées en direct !");
  };

  /* =========================================================
     2. GESTION ÉVÉNEMENTS 1-CLIC
     ========================================================= */
  window.ouvrirModalAjoutEvenement = function() {
    document.getElementById("modalAjoutEvenement").style.display = "flex";
  };
  window.fermerModalAjoutEvenement = function() {
    document.getElementById("modalAjoutEvenement").style.display = "none";
  };

  var tempImageUploaded = "";
  window.handleEventImageChoice = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      tempImageUploaded = e.target.result;
      var thumb = document.getElementById("eventImagePreviewThumb");
      thumb.src = tempImageUploaded;
      thumb.style.display = "block";
    };
    reader.readAsDataURL(file);
  };

  window.sauvegarderNouvelEvenement = function(e) {
    if(e) e.preventDefault();
    var titre = document.getElementById("eventTitre").value;
    var date = document.getElementById("eventDate").value;
    var badge = document.getElementById("eventBadge").value;
    var desc = document.getElementById("eventDesc").value;
    var imagePreset = document.getElementById("eventImagePreset") ? document.getElementById("eventImagePreset").value : "";
    var image = tempImageUploaded || imagePreset || "images/secofis.jpg";

    if (!titre || !date || !desc) {
      alert("Veuillez remplir le titre, la date et la description.");
      return;
    }

    var nouveauEvenement = {
      id: "ev_" + Date.now(),
      titre: titre,
      date: date,
      badge: badge,
      desc: desc,
      image: image
    };

    var listeActuelle = JSON.parse(localStorage.getItem("aeemci_evenements_custom") || "[]");
    listeActuelle.unshift(nouveauEvenement);
    localStorage.setItem("aeemci_evenements_custom", JSON.stringify(listeActuelle));

    alert("🎉 Nouvel événement « " + titre + " » publié avec succès sur le site public !");
    tempImageUploaded = "";
    fermerModalAjoutEvenement();
    chargerTableEvenements();
    rafraichirStatsDashboard();
  };

  function chargerTableEvenements() {
    var tbody = document.getElementById("listeEvenementsAdminBody");
    if (!tbody) return;

    var listeActuelle = JSON.parse(localStorage.getItem("aeemci_evenements_custom") || "[]");
    
    var html = `
      <tr>
        <td><img src="../images/maouloud.jpg" class="thumb-preview"></td>
        <td>Nuit Du MAHOULOUD 2026</td>
        <td>25-26 Août 2026</td>
        <td><span style="color: var(--studio-gold); font-weight:700;">PROCHAIN ÉVÉNEMENT</span></td>
        <td><span style="color: #10B981; font-weight: 600;">En direct</span></td>
      </tr>
      <tr>
        <td><img src="../images/secofis.jpg" class="thumb-preview"></td>
        <td>SECOFIS 2026</td>
        <td>22-28 Juillet 2026</td>
        <td>FORMATION</td>
        <td><span style="color: #10B981; font-weight: 600;">En direct</span></td>
      </tr>
    `;

    listeActuelle.forEach(function(item, index) {
      html += `
        <tr>
          <td><img src="${normaliserCheminAdmin(item.image)}" class="thumb-preview"></td>
          <td><strong>${item.titre}</strong></td>
          <td>${item.date}</td>
          <td><span style="color: var(--studio-gold);">${item.badge}</span></td>
          <td><button class="btn-studio-danger" onclick="supprimerEvenement(${index})">Supprimer 🗑️</button></td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  window.supprimerEvenement = function(index) {
    if (confirm("Voulez-vous vraiment supprimer cet événement du site public ?")) {
      var listeActuelle = JSON.parse(localStorage.getItem("aeemci_evenements_custom") || "[]");
      listeActuelle.splice(index, 1);
      localStorage.setItem("aeemci_evenements_custom", JSON.stringify(listeActuelle));
      chargerTableEvenements();
      rafraichirStatsDashboard();
    }
  };

  /* =========================================================
     3. GESTION DES MEMBRES DU BUREAU
     ========================================================= */
  window.ouvrirModalAjoutMembre = function() {
    document.getElementById("modalAjoutMembre").style.display = "flex";
  };
  window.fermerModalAjoutMembre = function() {
    document.getElementById("modalAjoutMembre").style.display = "none";
  };

  var tempPhotoUploaded = "";
  window.handleMembrePhotoChoice = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      tempPhotoUploaded = e.target.result;
      var thumb = document.getElementById("membrePhotoPreviewThumb");
      thumb.src = tempPhotoUploaded;
      thumb.style.display = "block";
    };
    reader.readAsDataURL(file);
  };

  window.sauvegarderNouveauMembre = function(e) {
    if(e) e.preventDefault();
    var nom = document.getElementById("membreNom").value;
    var poste = document.getElementById("membrePoste").value;
    var pole = document.getElementById("membrePole").value;
    var photo = tempPhotoUploaded || "images/logo.png";

    if (!nom || !poste) {
      alert("Veuillez saisir le nom et le poste du membre.");
      return;
    }

    var nouveauMembre = {
      id: "mb_" + Date.now(),
      nom: nom,
      poste: poste,
      pole: pole,
      photo: photo
    };

    var listeBureau = JSON.parse(localStorage.getItem("aeemci_bureau_custom") || "[]");
    listeBureau.unshift(nouveauMembre);
    localStorage.setItem("aeemci_bureau_custom", JSON.stringify(listeBureau));

    alert("👤 Nouveau membre « " + nom + " » ajouté au bureau avec succès !");
    tempPhotoUploaded = "";
    fermerModalAjoutMembre();
    chargerTableBureau();
    rafraichirStatsDashboard();
  };

  function chargerTableBureau() {
    var tbody = document.getElementById("listeBureauAdminBody");
    if (!tbody) return;

    var listeBureau = JSON.parse(localStorage.getItem("aeemci_bureau_custom") || "[]");

    var html = `
      <tr>
        <td><img src="../images/membres/sow-mohamed.jpg" class="thumb-preview" onerror="this.src='../images/logo.png'"></td>
        <td>Sow Mohamed</td>
        <td>Président du Sous-Comité</td>
        <td><span style="color: var(--studio-gold);">Présidence</span></td>
        <td><span style="color: #10B981; font-weight: 600;">Officiel</span></td>
      </tr>
      <tr>
        <td><img src="../images/membres/diabate-fode.jpg" class="thumb-preview" onerror="this.src='../images/logo.png'"></td>
        <td>Diabaté Fodé</td>
        <td>Secrétaire Général</td>
        <td><span style="color: var(--studio-gold);">Secrétariat Général</span></td>
        <td><span style="color: #10B981; font-weight: 600;">Officiel</span></td>
      </tr>
    `;

    listeBureau.forEach(function(item, index) {
      html += `
        <tr>
          <td><img src="${normaliserCheminAdmin(item.photo)}" class="thumb-preview" onerror="this.src='../images/logo.png'"></td>
          <td><strong>${item.nom}</strong></td>
          <td>${item.poste}</td>
          <td><span style="color: var(--studio-gold);">${item.pole}</span></td>
          <td><button class="btn-studio-danger" onclick="supprimerMembre(${index})">Supprimer 🗑️</button></td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  window.supprimerMembre = function(index) {
    if (confirm("Voulez-vous supprimer ce membre du bureau ?")) {
      var listeBureau = JSON.parse(localStorage.getItem("aeemci_bureau_custom") || "[]");
      listeBureau.splice(index, 1);
      localStorage.setItem("aeemci_bureau_custom", JSON.stringify(listeBureau));
      chargerTableBureau();
      rafraichirStatsDashboard();
    }
  };

  /* =========================================================
     4. GESTION GALERIE PHOTO (AVEC APERÇU ET PRÉSÉLECTIONS)
     ========================================================= */
  window.ouvrirModalAjoutGalerie = function() {
    document.getElementById("modalAjoutGalerie").style.display = "flex";
  };
  window.fermerModalAjoutGalerie = function() {
    document.getElementById("modalAjoutGalerie").style.display = "none";
  };

  var tempGaleriePhotoUploaded = "";
  window.handleGaleriePhotoChoice = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      tempGaleriePhotoUploaded = e.target.result;
      var thumb = document.getElementById("galeriePhotoPreviewThumb");
      thumb.src = tempGaleriePhotoUploaded;
      thumb.style.display = "block";
      document.getElementById("msgPhotoOk").style.display = "block";
    };
    reader.readAsDataURL(file);
  };

  window.sauvegarderNouvellePhotoGalerie = function(e) {
    if(e) e.preventDefault();
    var titre = document.getElementById("galerieTitre").value;
    var categorie = document.getElementById("galerieCategorie").value;
    var photoPreset = document.getElementById("galeriePhotoPreset") ? document.getElementById("galeriePhotoPreset").value : "";
    var photo = tempGaleriePhotoUploaded || photoPreset || "images/secofis.jpg";

    if (!titre || !photo) {
      alert("Veuillez remplir le titre et sélectionner une photo.");
      return;
    }

    var nouvellePhoto = {
      id: "gal_" + Date.now(),
      titre: titre,
      categorie: categorie,
      photo: photo,
      date: new Date().toLocaleDateString('fr-FR')
    };

    var listeGalerie = JSON.parse(localStorage.getItem("aeemci_galerie_custom") || "[]");
    listeGalerie.unshift(nouvellePhoto);
    localStorage.setItem("aeemci_galerie_custom", JSON.stringify(listeGalerie));

    alert("🖼️ Photo « " + titre + " » publiée avec succès dans la Galerie publique !");
    tempGaleriePhotoUploaded = "";
    fermerModalAjoutGalerie();
    chargerTableGalerie();
    rafraichirStatsDashboard();
  };

  function chargerTableGalerie() {
    var tbody = document.getElementById("listeGalerieAdminBody");
    if (!tbody) return;

    var listeGalerie = JSON.parse(localStorage.getItem("aeemci_galerie_custom") || "[]");

    var html = "";
    listeGalerie.forEach(function(item, index) {
      html += `
        <tr>
          <td><img src="${normaliserCheminAdmin(item.photo)}" class="thumb-preview" onerror="this.src='../images/logo.png'"></td>
          <td><strong>${item.titre}</strong></td>
          <td><span style="color: var(--studio-gold);">${item.categorie}</span></td>
          <td>${item.date}</td>
          <td><button class="btn-studio-danger" onclick="supprimerPhotoGalerie(${index})">Supprimer 🗑️</button></td>
        </tr>
      `;
    });

    if (listeGalerie.length === 0) {
      html = `<tr><td colspan="5" style="text-align: center; color: var(--studio-subtext); padding: 24px;">Aucune photo personnalisée ajoutée. Utilisez le bouton « + Publier une photo dans la Galerie ».</td></tr>`;
    }

    tbody.innerHTML = html;
  }

  window.supprimerPhotoGalerie = function(index) {
    if (confirm("Voulez-vous supprimer cette photo de la Galerie publique ?")) {
      var listeGalerie = JSON.parse(localStorage.getItem("aeemci_galerie_custom") || "[]");
      listeGalerie.splice(index, 1);
      localStorage.setItem("aeemci_galerie_custom", JSON.stringify(listeGalerie));
      chargerTableGalerie();
      rafraichirStatsDashboard();
    }
  };

  function rafraichirStatsDashboard() {
    var listEv = JSON.parse(localStorage.getItem("aeemci_evenements_custom") || "[]");
    var listMb = JSON.parse(localStorage.getItem("aeemci_bureau_custom") || "[]");
    var listGal = JSON.parse(localStorage.getItem("aeemci_galerie_custom") || "[]");

    var elEvCount = document.getElementById("dashEventsCount");
    if(elEvCount) elEvCount.textContent = listEv.length + 5;

    var elGalCount = document.getElementById("dashGalerieCount");
    if(elGalCount) elGalCount.textContent = listGal.length;
  }

  window.deconnexionStudio = function() {
    sessionStorage.removeItem("aeemci_studio_auth");
    location.reload();
  };
})();
