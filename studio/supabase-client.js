/* ==========================================================================
   STUDIO AEEMCI KOUMASSI — CLIENT SUPABASE & SERVICE D'AUTHENTIFICATION (2026)
   ========================================================================== */

// Config Supabase (Clés de démonstration / Production)
const SUPABASE_URL = "https://aeemci-koumassi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZW1jaS1rb3VtYXNzaSIsInJvbGUiOiJhb24iLCJpYXQiOjE3MDY3MDY4MDAsImV4cCI6MjAyMjI4MjgwMH0.demo_key";

let supabaseClient = null;
if (typeof supabase !== 'undefined' && supabase.createClient) {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.log("Supabase initialisé en mode sécurisé local.");
  }
}

// Module d'Authentification Administrateur
window.studioAuth = {
  login: async function(email, password) {
    // 1. Essai d'authentification Supabase si disponible
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });
        if (!error && data.session) {
          const userSession = {
            token: data.session.access_token,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24h
            user: {
              email: data.user.email,
              nom: data.user.user_metadata?.full_name || "Sow Mohamed",
              role: data.user.user_metadata?.role || "Président Exécutif",
              initiales: "SM"
            }
          };
          localStorage.setItem('studio_aeemci_session', JSON.stringify(userSession));
          return { success: true };
        }
      } catch (e) {
        console.warn("Mode Auth direct fallback.");
      }
    }

    // 2. Mode d'Authentification Intégré (Comité Exécutif Koumassi)
    // Comptes de démonstration prédéfinis pour le bureau AEEMCI Koumassi
    const comptesAutorises = [
      { email: "admin.koumassi@aeemci.ci", pass: "Aeemci2026!", nom: "Sow Mohamed", role: "Président Exécutif", initiales: "SM" },
      { email: "sg.koumassi@aeemci.ci", pass: "Koumassi2026!", nom: "Diabaté Fodé", role: "Secrétaire Général", initiales: "DF" },
      { email: "com.koumassi@aeemci.ci", pass: "Media2026!", nom: "Kokora Mohamed", role: "Chargé de Com", initiales: "KM" }
    ];

    const match = comptesAutorises.find(c => c.email.toLowerCase() === email.toLowerCase());
    
    // Si l'utilisateur saisit n'importe quel email valide avec au moins 6 caractères de mot de passe en mode démo
    if (match && match.pass === password) {
      const userSession = {
        token: "token_executif_" + Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
        user: { email: match.email, nom: match.nom, role: match.role, initiales: match.initiales }
      };
      localStorage.setItem('studio_aeemci_session', JSON.stringify(userSession));
      return { success: true };
    } else if (!match && email.includes('@') && password.length >= 6) {
      // Démo universelle pour le bureau
      const userSession = {
        token: "token_demo_" + Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
        user: { email: email, nom: "Administrateur AEEMCI", role: "Membre du Bureau", initiales: "AE" }
      };
      localStorage.setItem('studio_aeemci_session', JSON.stringify(userSession));
      return { success: true };
    }

    return { success: false, error: "Identifiants incorrects. Mot de passe de démo recommandé : Aeemci2026!" };
  },

  logout: function() {
    localStorage.removeItem('studio_aeemci_session');
    window.location.href = 'login.html';
  },

  isAuthenticated: function() {
    const session = JSON.parse(localStorage.getItem('studio_aeemci_session'));
    return session && session.token && (session.expiresAt > Date.now());
  }
};

// Module de Gestion de la Base de Données Militants (CRUD Supabase + LocalStorage)
window.militantsDb = {
  // Récupérer les militants
  fetchMilitants: async function() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('militants')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          localStorage.setItem('aeemci_militants_db', JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn("Utilisation de la base de données locale.");
      }
    }
    return JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
  },

  // Ajouter un militant (Public & Admin)
  insertMilitant: async function(militantData) {
    const nouveauMilitant = {
      id: Date.now(),
      nom: militantData.nom,
      quartier: militantData.quartier || "Koumassi Prodomo",
      ecole: militantData.ecole || "Lycée / Université",
      telephone: militantData.telephone,
      statut: militantData.statut || "attente",
      date: new Date().toISOString().split('T')[0]
    };

    if (supabaseClient) {
      try {
        await supabaseClient.from('militants').insert([nouveauMilitant]);
      } catch (e) {
        console.warn("Sauvegarde dans la base locale.");
      }
    }

    let liste = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
    liste.unshift(nouveauMilitant);
    localStorage.setItem('aeemci_militants_db', JSON.stringify(liste));

    return nouveauMilitant;
  },

  // Mettre à jour le statut (Valider / Rejeter)
  updateStatus: async function(id, nouveauStatut) {
    if (supabaseClient) {
      try {
        await supabaseClient
          .from('militants')
          .update({ statut: nouveauStatut })
          .eq('id', id);
      } catch (e) {
        console.warn("Mise à jour locale.");
      }
    }

    let liste = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
    const item = liste.find(m => m.id === id);
    if (item) {
      item.statut = nouveauStatut;
      localStorage.setItem('aeemci_militants_db', JSON.stringify(liste));
    }
    return liste;
  },

  // Supprimer un militant
  deleteMilitant: async function(id) {
    if (supabaseClient) {
      try {
        await supabaseClient
          .from('militants')
          .delete()
          .eq('id', id);
      } catch (e) {
        console.warn("Suppression locale.");
      }
    }

    let liste = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
    liste = liste.filter(m => m.id !== id);
    localStorage.setItem('aeemci_militants_db', JSON.stringify(liste));
    return liste;
  }
};
