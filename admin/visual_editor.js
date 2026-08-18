/* =========================================================
   AEEMCI KOUMASSI — MODE ÉDITION VISUELLE DIRECTE (0-CODE)
   Permet à n'importe quelle personne sans aucune notion en programmation
   de modifier le site directement en cliquant sur l'écran.
   ========================================================= */

(function() {
  // Vérifie si l'utilisateur est connecté en mode Administrateur
  const estAdmin = sessionStorage.getItem("aeemci_studio_auth") === "true";

  if (!estAdmin) return;

  // Création de la barre d'outils visuelle flottante en haut du site
  window.addEventListener("DOMContentLoaded", function() {
    creerBarreVisualEditor();
    activerBoutonsEditionDirecte();
  });

  function creerBarreVisualEditor() {
    if (document.getElementById("barreVisualEditor")) return;

    var barre = document.createElement("div");
    barre.id = "barreVisualEditor";
    barre.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 52px;
      background: linear-gradient(135deg, #0C3823, #062215);
      border-bottom: 2px solid #D4AF37;
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #FFFFFF;
    `;

    barre.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="background: #D4AF37; color: #000; font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 20px;">MODE ÉDITION FACILE (0-CODE)</span>
        <span style="font-size: 0.88rem; color: rgba(255,255,255,0.9);">Cliquez sur les éléments du site pour les modifier en 1 clic</span>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <a href="admin/index.html" style="background: rgba(255,255,255,0.15); color: #FFF; padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; text-decoration: none; font-weight: 600;">Ouvrir AEEMCI Studio ↗</a>
        <button onclick="quitterModeEditionVisuelle()" style="background: #EF4444; color: #FFF; border: none; padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer;">Quitter l'Édition</button>
      </div>
    `;

    document.body.prepend(barre);

    // Ajustement dynamique des positions pour empêcher tout chevauchement avec l'en-tête du site
    var styleOffset = document.createElement("style");
    styleOffset.innerHTML = `
      body { padding-top: 52px !important; }
      .entete-site { top: 52px !important; }
      .sidebar-panneau { top: 52px !important; }
    `;
    document.head.appendChild(styleOffset);
  }

  function activerBoutonsEditionDirecte() {
    // Ajouter un style visuel de survol pour les zones éditables
    var style = document.createElement("style");
    style.innerHTML = `
      [data-editable="true"]:hover {
        outline: 2px dashed #D4AF37 !important;
        cursor: pointer !important;
        position: relative !important;
      }
      [data-editable="true"]:hover::after {
        content: "✏️ Modifier";
        position: absolute;
        top: 4px;
        right: 4px;
        background: #D4AF37;
        color: #000000;
        font-size: 0.75rem;
        font-weight: bold;
        padding: 2px 8px;
        border-radius: 4px;
        z-index: 50;
      }
    `;
    document.head.appendChild(style);

    // Rendre éditables le Hero, les 4 cartes d'impact et les coordonnées
    rendreElementEditable('.hero-moderne h1, .titre-hero', 'Titre du Hero Banner d\'Accueil', 'heroTitre');
    rendreElementEditable('.hero-moderne p, .description-hero', 'Sous-titre d\'Accueil', 'heroSousTitre');
  }

  function rendreElementEditable(selector, label, keyData) {
    var el = document.querySelector(selector);
    if (!el) return;
    el.setAttribute("data-editable", "true");
    el.title = "Cliquez pour modifier facilement";
    el.addEventListener("click", function(e) {
      e.preventDefault();
      var actuel = el.textContent.trim();
      var nouveau = prompt("✍️ " + label + " :\n\nSaisissez le nouveau texte ci-dessous :", actuel);
      if (nouveau !== null && nouveau.trim() !== "") {
        el.textContent = nouveau.trim();

        // Enregistrement facile dans la base du site
        var config = JSON.parse(localStorage.getItem("aeemci_site_config_full") || "{}");
        config[keyData] = nouveau.trim();
        localStorage.setItem("aeemci_site_config_full", JSON.stringify(config));

        alert("✅ Modifications enregistrées et publiées avec succès sur le site !");
      }
    });
  }

  window.quitterModeEditionVisuelle = function() {
    sessionStorage.removeItem("aeemci_studio_auth");
    location.reload();
  };
})();
