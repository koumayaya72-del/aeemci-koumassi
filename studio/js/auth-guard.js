/* ==========================================================================
   STUDIO AEEMCI KOUMASSI — SCRIPT DE CONTRÔLE D'ACCÈS GLOBAL (AUTH-GUARD)
   ========================================================================== */

(function() {
  'use strict';

  // Exclure la vérification sur la page de connexion
  const pageActuelle = window.location.pathname.split('/').pop();
  if (pageActuelle === 'login.html') return;

  document.addEventListener('DOMContentLoaded', function() {
    verifierSessionAdminGlobal();
  });

  function verifierSessionAdminGlobal() {
    const sessionRaw = localStorage.getItem('studio_aeemci_session');
    let session = null;

    try {
      session = JSON.parse(sessionRaw);
    } catch (e) {
      session = null;
    }

    const estAuthentifie = session && session.token && (session.expiresAt > Date.now());

    if (!estAuthentifie) {
      console.warn("🔐 Accès non autorisé : Redirection vers studio/login.html");
      window.location.href = 'login.html';
      return;
    }

    // Personnalisation des données de l'administrateur connecté dans l'interface
    const nomAdmin = document.querySelector('.nom-admin');
    const roleAdmin = document.querySelector('.role-admin');
    const avatarAdmin = document.querySelector('.avatar-admin');

    if (session.user) {
      if (nomAdmin) nomAdmin.textContent = session.user.nom || 'Sow Mohamed';
      if (roleAdmin) roleAdmin.textContent = session.user.role || 'Président Exécutif';
      if (avatarAdmin && session.user.initiales) avatarAdmin.textContent = session.user.initiales;
    }

    // Injection automatique du bouton de déconnexion dans la TopBar
    injecterBoutonDeconnexion();
  }

  function injecterBoutonDeconnexion() {
    const containerActions = document.querySelector('.topbar-actions');
    if (containerActions && !document.getElementById('btnDeconnexionCMS')) {
      const btnLogout = document.createElement('button');
      btnLogout.id = 'btnDeconnexionCMS';
      btnLogout.className = 'bouton-action-contour';
      btnLogout.style.cssText = 'border-color: #EF4444; color: #EF4444; margin-left: 12px; font-weight: 700; font-size: 0.82rem; padding: 7px 15px; cursor: pointer;';
      btnLogout.innerHTML = '🚪 Déconnexion';
      btnLogout.onclick = window.logoutAdmin;
      containerActions.appendChild(btnLogout);
    }
  }

  // Fonction globale de déconnexion
  window.logoutAdmin = function() {
    if (confirm("Voulez-vous vraiment vous déconnecter du Studio d'Administration AEEMCI ?")) {
      localStorage.removeItem('studio_aeemci_session');
      if (window.supabase) {
        window.supabase.auth.signOut().catch(() => {});
      }
      window.location.href = 'login.html';
    }
  };
})();
