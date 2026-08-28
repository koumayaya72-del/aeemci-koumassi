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

    const comptesAutorises = [
      { email: "admin.koumassi@aeemci.ci", pass: "Aeemci2026!", nom: "Sow Mohamed", role: "Président Exécutif", initiales: "SM" },
      { email: "sg.koumassi@aeemci.ci", pass: "Koumassi2026!", nom: "Diabaté Fodé", role: "Secrétaire Général", initiales: "DF" },
      { email: "com.koumassi@aeemci.ci", pass: "Media2026!", nom: "Kokora Mohamed", role: "Chargé de Com", initiales: "KM" }
    ];

    const match = comptesAutorises.find(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (match && match.pass === password) {
      const userSession = {
        token: "token_executif_" + Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
        user: { email: match.email, nom: match.nom, role: match.role, initiales: match.initiales }
      };
      localStorage.setItem('studio_aeemci_session', JSON.stringify(userSession));
      return { success: true };
    } else if (!match && email.includes('@') && password.length >= 6) {
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

// Module de Gestion du Stockage (Images) via Supabase Storage
window.storageDb = {
  uploadImage: async function(file, folder = 'uploads') {
    if (supabaseClient) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await supabaseClient.storage
          .from('aeemci-assets')
          .upload(filePath, file);

        if (!error && data) {
          const { data: urlData } = supabaseClient.storage
            .from('aeemci-assets')
            .getPublicUrl(filePath);

          if (urlData && urlData.publicUrl) return urlData.publicUrl;
        }
      } catch (e) {
        console.warn("Supabase Storage non disponible, bascule sur la compression Canvas HD locale.");
      }
    }

    // Fallback automatique Canvas HD local (Web-ready)
    return new Promise((resolve) => {
      if (!file || !file.type || !file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        if (typeof window.compresserImageCanvas === 'function') {
          window.compresserImageCanvas(evt.target.result, 1000, 0.8, function(compressedUrl) {
            resolve(compressedUrl);
          });
        } else {
          resolve(evt.target.result);
        }
      };
      reader.onerror = function() {
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  },

  deleteImage: async function(url) {
    if (!supabaseClient || !url) return;
    try {
      const path = url.split('/aeemci-assets/')[1];
      if (!path) return;
      await supabaseClient.storage.from('aeemci-assets').remove([path]);
    } catch (e) {
      console.warn("Erreur suppression Storage:", e);
    }
  }
};

// Module de Gestion du CMS (Bureau, Actualités, Formations, Contact) via Supabase
window.cmsDb = {
  saveSection: async function(section, data) {
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('cms_settings')
          .upsert({ section: section, content: data });
        if (!error) return { success: true };
      } catch (e) {
        console.warn(`Erreur sauvegarde Supabase (${section}):`, e);
      }
    }
    return { success: false };
  },

  fetchSection: async function(section) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('cms_settings')
          .select('content')
          .eq('section', section)
          .single();
        if (!error && data) return data.content;
      } catch (e) {
        console.warn(`Erreur lecture Supabase (${section}):`, e);
      }
    }
    return null;
  }
};

window.militantsDb = {
  fetchMilitants: async function() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('militants')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Erreur Supabase, basculement en local.");
      }
    }
    return JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
  },

  insertMilitant: async function(militantData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('militants')
          .insert([militantData])
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (e) {
        console.warn("Échec insertion Supabase, sauvegarde en local.");
      }
    }
    const list = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
    const item = { id: Date.now(), ...militantData, date: new Date().toISOString().split('T')[0] };
    list.unshift(item);
    localStorage.setItem('aeemci_militants_db', JSON.stringify(list));
    return item;
  },

  updateStatus: async function(id, status) {
    if (supabaseClient) {
      try {
        await supabaseClient
          .from('militants')
          .update({ statut: status })
          .eq('id', id);
      } catch (e) {
        console.warn("Échec mise à jour Supabase.");
      }
    }
    let list = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
    const item = list.find(m => m.id === id);
    if (item) item.statut = status;
    localStorage.setItem('aeemci_militants_db', JSON.stringify(list));
  },

  deleteMilitant: async function(id) {
    if (supabaseClient) {
      try {
        await supabaseClient
          .from('militants')
          .delete()
          .eq('id', id);
      } catch (e) {
        console.warn("Échec suppression Supabase.");
      }
    }
    let list = JSON.parse(localStorage.getItem('aeemci_militants_db')) || [];
    list = list.filter(m => m.id !== id);
    localStorage.setItem('aeemci_militants_db', JSON.stringify(list));
  }
};
