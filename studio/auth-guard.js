/* ==========================================================================
   STUDIO AEEMCI KOUMASSI — SCRIPT DE SÉCURITÉ & AUTH-GUARD (2026)
   ========================================================================== */

(function() {
  'use strict';

  // Ne pas exécuter la vérification sur la page de connexion elle-même
  const pageActuelle = window.location.pathname.split('/').pop();
  if (pageActuelle === 'login.html') return;

  document.addEventListener('DOMContentLoaded', function() {
    verifierSessionAdmin();
  });

  function verifierSessionAdmin() {
    const session = JSON.parse(localStorage.getItem('studio_aeemci_session'));
    const isAuthentifie = session && session.token && (session.expiresAt > Date.now());

    if (!isAuthentifie) {
      console.warn("🔐 Accès refusé : Redirection vers studio/login.html");
      window.location.href = 'login.html';
      return;
    }

    // Affichage des informations de l'utilisateur connecté dans la TopBar
    const nomEl = document.querySelector('.nom-admin');
    const roleEl = document.querySelector('.role-admin');
    const avatarEl = document.querySelector('.avatar-admin');

    if (nomEl && session.user) nomEl.textContent = session.user.nom || 'Sow Mohamed';
    if (roleEl && session.user) roleEl.textContent = session.user.role || 'Président Exécutif';
    if (avatarEl && session.user && session.user.initiales) avatarEl.textContent = session.user.initiales;

    // Ajout d'un bouton de déconnexion dans la TopBar s'il n'existe pas encore
    ajouterBoutonDeconnexion();
  }

  function ajouterBoutonDeconnexion() {
    const topbarActions = document.querySelector('.topbar-actions');
    if (topbarActions && !document.getElementById('btnDeconnexionStudio')) {
      const btn = document.createElement('button');
      btn.id = 'btnDeconnexionStudio';
      btn.className = 'bouton-action-contour';
      btn.style.cssText = 'border-color: #EF4444; color: #EF4444; margin-left: 10px; font-size: 0.82rem; padding: 6px 14px;';
      btn.innerHTML = '🚪 Déconnexion';
      btn.onclick = window.deconnexionStudio;
      topbarActions.appendChild(btn);
    }
  }

  window.deconnexionStudio = function() {
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter du Studio AEEMCI ?")) {
      localStorage.removeItem('studio_aeemci_session');
      if (window.supabase) {
        window.supabase.auth.signOut().catch(() => {});
      }
      window.location.href = 'login.html';
    }
  };
})();
