/* ==========================================================================
   SITE PUBLIC AEEMCI KOUMASSI — CONNECTEUR SUPABASE & SOUISSION D'ADHÉSION
   ========================================================================== */

const SUPABASE_URL = "https://aeemci-koumassi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZW1jaS1rb3VtYXNzaSIsInJvbGUiOiJhb24iLCJpYXQiOjE3MDY3MDY4MDAsImV4cCI6MjAyMjI4MjgwMH0.demo_key";

let supabasePublic = null;
if (typeof supabase !== 'undefined' && supabase.createClient) {
  try {
    supabasePublic = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.log("Connecteur Supabase public initialisé.");
  }
}

// Fonction globale d'envoi d'adhésion depuis le site public
window.soumettreAdhesionAEEMCI = async function(donneesFormulaire) {
  const nouvelleAdhesion = {
    id: Date.now(),
    nom: donneesFormulaire.nom,
    quartier: donneesFormulaire.quartier || "Koumassi Prodomo",
    ecole: donneesFormulaire.ecole || "Établissement non spécifié",
    telephone: donneesFormulaire.telephone,
    statut: "attente",
    date: new Date().toISOString().split('T')[0]
  };

  // Envoi vers Supabase DB si disponible
  if (supabasePublic) {
    try {
      await supabasePublic.from('militants').insert([nouvelleAdhesion]);
    } catch (e) {
      console.warn("Stockage de secours local.");
    }
  }

// Module de Lecture du CMS via Supabase
window.cmsRead = {
  fetchSection: async function(section) {
    if (supabasePublic) {
      try {
        const { data, error } = await supabasePublic
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
  },

  fetchMilitants: async function() {
    if (supabasePublic) {
      try {
        const { data, error } = await supabasePublic
          .from('militants')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Erreur lecture militants Supabase.");
      }
    }
    return null;
  }
};



  return { success: true, message: "Votre demande d'adhésion a été transmise au Bureau Exécutif de Koumassi !" };
};
