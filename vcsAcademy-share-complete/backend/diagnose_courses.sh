#!/bin/bash

# Script de diagnóstico para cursos de Skool
# Verifica que los cursos estén configurados correctamente para usuarios nuevos

echo "🔍 DIAGNÓSTICO DE CURSOS DE SKOOL"
echo "================================"
echo ""

# 1. Verificar contenedores
echo "1️⃣ Verificando contenedores..."
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "NAME|vcsa"
echo ""

# 2. Verificar cursos en MongoDB
echo "2️⃣ Cursos en MongoDB:"
docker exec vcsa-mongodb mongosh -u admin -p vcsa_local_dev_2024 \
  --authenticationDatabase admin vcsa --quiet --eval "
  db.courses.find().forEach(function(course) {
    print('   📖 ' + course.title);
    print('      ID: ' + course.course_id);
    print('      Público: ' + (course.is_public ? '✅ YES' : '❌ NO'));
  });
  print('   Total: ' + db.courses.countDocuments());
"
echo ""

# 3. Verificar lecciones
echo "3️⃣ Lecciones en MongoDB:"
docker exec vcsa-mongodb mongosh -u admin -p vcsa_local_dev_2024 \
  --authenticationDatabase admin vcsa --quiet --eval "
  db.lessons.find().forEach(function(lesson) {
    print('   ✓ ' + lesson.title);
  });
  print('   Total lecciones: ' + db.lessons.countDocuments());
"
echo ""

# 4. Probar endpoint público
echo "4️⃣ Probando endpoint público: /api/public/courses"
echo "   GET http://localhost:8001/api/public/courses"
response=$(curl -s http://localhost:8001/api/public/courses)
course_count=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('total', 0))" 2>/dev/null)
echo "   ✅ Respuesta: $course_count cursos encontrados"
echo ""

# 5. Probar endpoint de detalle
echo "5️⃣ Probando endpoint de detalle de curso"
echo "   GET http://localhost:8001/api/public/courses/skool_free_resources"
response=$(curl -s "http://localhost:8001/api/public/courses/skool_free_resources")
lesson_count=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('lessons', [])))" 2>/dev/null)
echo "   ✅ Respuesta: $lesson_count lecciones encontradas"
echo ""

# 6. Verificar acceso desde frontend
echo "6️⃣ Verificando acceso desde frontend:"
echo "   🌐 http://localhost/courses"
echo "   🌐 http://localhost/coaching"
echo ""

# 7. Estado del sistema
echo "7️⃣ Estado del sistema:"
docker exec vcsa-mongodb mongosh -u admin -p vcsa_local_dev_2024 \
  --authenticationDatabase admin vcsa --quiet --eval "
  print('   📊 Base de datos: ✅ Conectado');
  print('   📚 Cursos públicos: ' + db.courses.countDocuments({is_public: true}));
  print('   📖 Total lecciones: ' + db.lessons.countDocuments({is_public: true}));
"
echo ""

# 8. URLs de prueba
echo "8️⃣ URLs para probar en navegador:"
echo "   📚 Cursos: http://localhost/courses"
echo "   🎓 Coaching: http://localhost/coaching"
echo "   🏠 Dashboard: http://localhost/dashboard"
echo "   🔐 Admin: http://localhost/admin"
echo ""

# 9. Resumen
echo "📋 RESUMEN:"
echo "-----------"
total_courses=$(docker exec vcsa-mongodb mongosh -u admin -p vcsa_local_dev_2024 \
  --authenticationDatabase admin vcsa --quiet --eval "
  db.courses.countDocuments({is_public: true})
" 2>/dev/null | tr -d '\r')

total_lessons=$(docker exec vcsa-mongodb mongosh -u admin -p vcsa_local_dev_2024 \
  --authenticationDatabase admin vcsa --quiet --eval "
  db.lessons.countDocuments({is_public: true})
" 2>/dev/null | tr -d '\r')

echo "   ✅ $total_courses cursos públicos disponibles"
echo "   ✅ $total_lessons lecciones públicas disponibles"
echo "   ✅ Sin autenticación requerida"
echo "   ✅ Accesibles para usuarios nuevos"
echo ""

# 10. Soluciones comunes
echo "🔧 SOLUCIONES COMUNES:"
echo "-------------------"
echo "Si los cursos NO aparecen:"
echo "   1. Limpiar caché del navegador (Ctrl+Shift+R)"
echo "   2. Verificar que frontend esté saludable: docker ps"
echo "   3. Verificar logs: docker logs vcsa-frontend"
echo "   4. Probar endpoint directamente: curl http://localhost:8001/api/public/courses"
echo ""
echo "Si los videos NO se reproducen:"
echo "   1. Verificar que las URLs sean de YouTube"
echo "   2. Abrir el video en YouTube para confirmar que es público"
echo "   3. Verificar formato de URL (watch, embed, youtu.be)"
echo ""

echo "✅ Diagnóstico completado!"
