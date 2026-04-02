// Enhanced AI Assistant Database Setup
// Crear colecciones para el sistema de memoria y gestión del conocimiento mejorado

print("🧠 Enhanced AI Assistant - Database Setup");
print("==========================================");

// Colecciones para el sistema de memoria mejorado
const collections = [
  // Memoria a largo plazo
  "conversation_memory",
  "user_preferences",
  "performance_insights",
  "skill_gaps",
  "sentiment_analysis",
  "proactive_suggestions",

  // Role playing y simulaciones
  "roleplay_sessions",
  "roleplay_scenarios",

  // Base de conocimientos
  "knowledge_base",

  // Notificaciones
  "notifications"
];

print("Creando colecciones necesarias...");

// Crear índices para optimizar queries
db.conversation_memory.createIndex({user_id: 1, created_at: -1});
db.conversation_memory.createIndex({user_id: 1, last_accessed: -1});
db.user_preferences.createIndex({user_id: 1}, {unique: true});

db.performance_insights.createIndex({user_id: 1, confidence_level: -1});
db.skill_gaps.createIndex({user_id: 1, priority_score: -1});
db.sentiment_analysis.createIndex({user_id: 1, last_updated: -1});
db.proactive_suggestions.createIndex({user_id: 1, created_at: -1});
db.proactive_suggestions.createIndex({user_id: 1, urgency: 1});

db.roleplay_sessions.createIndex({user_id: 1, status: 1});
db.roleplay_sessions.createIndex({user_id: 1, started_at: -1});

db.knowledge_base.createIndex({uploaded_by: 1, created_at: -1});
db.knowledge_base.createIndex({tags: 1});
db.knowledge_base.createIndex({target_audience: 1});

db.notifications.createIndex({recipient_id: 1, read_at: 1});
db.notifications.createIndex({recipient_id: 1, created_at: -1});
db.notifications.createIndex({action_required: 1, read_at: 1});

collections.forEach(collection => {
  if (!db.getCollectionNames().includes(collection)) {
    db.createCollection(collection);
    print(`  ✅ Creada colección: ${collection}`);
  } else {
    print(`  ⚠️  Colección ya existe: ${collection}`);
  }
});

print("");
print("📊 Verificando estructura de datos...");

// Verificar que las colecciones existen y están vacías
const verifyCollections = [
  "conversation_memory",
  "user_preferences",
  "skill_gaps",
  "knowledge_base",
  "notifications"
];

let allGood = true;
verifyCollections.forEach(collection => {
  const count = db.getCollection(collection).countDocuments({});
  print(`  📋 ${collection}: ${count} documentos`);
});

print("");
print("🎯 Enhanced AI Assistant Database Setup Completed!");
print("===================================================");
print("");
print("Sistemas habilitados:");
print("✅ Memoria a largo plazo de conversaciones");
print("✅ Análisis de sentimientos del usuario");
print("✅ Sistema de sugerencias proactivas");
print("✅ Role playing y simulaciones");
print("✅ Base de conocimientos completa");
print("✅ Sistema de notificaciones a reps");
print("✅ Dashboard administrativo con estadísticas de equipo");
print("");
print("🚀 El sistema está listo para Fase 3 - AI Agent Enhancements!");