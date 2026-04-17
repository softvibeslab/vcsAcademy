#!/bin/bash

################################################################################
# VCSA Production Deployment Script
# Vacation Club Sales Academy - MVP 1.0.0
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="/var/www/vcsa"
BACKUP_DIR="/var/backups/vcsa"
LOG_FILE="/var/log/vcsa-deploy.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "Este script no debe ejecutarse como root"
        log_warning "Ejecuta como: ./deploy-vcsa.sh"
        exit 1
    fi
}

check_prerequisites() {
    log "Verificando prerequisitos..."

    # Check if running as root
    check_root

    # Check if user has sudo access
    if ! sudo -v &> /dev/null; then
        log_error "Este script requiere acceso sudo"
        exit 1
    fi

    # Check if in project directory
    if [[ ! -f "$SCRIPT_DIR/docker-compose.prod.yml" ]]; then
        log_error "docker-compose.prod.yml no encontrado en $SCRIPT_DIR"
        log_error "Ejecuta este script desde el directorio del proyecto"
        exit 1
    fi

    # Check if .env exists
    if [[ ! -f "$SCRIPT_DIR/.env" ]]; then
        log_error ".env file no encontrado"
        log_error "Crea .env file primero:"
        log_warning "cp .env.example .env"
        log_warning "Luego edita .env con tus configuraciones"
        exit 1
    fi

    # Check Docker installation
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        log_warning "Instala Docker: https://docs.docker.com/engine/install/"
        exit 1
    fi

    # Check Docker Compose installation
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose no está instalado"
        exit 1
    fi

    log_success "Todos los prerequisitos cumplidos ✅"
}

create_backup() {
    log "Creando backup..."

    # Create backup directory
    sudo mkdir -p "$BACKUP_DIR"

    # Backup MongoDB
    if docker ps | grep -q vcsa_mongodb; then
        log "Backup MongoDB..."
        sudo docker exec vcsa_mongodb mongodump --archive=/tmp/mongo_backup.gz --gzip
        sudo docker cp vcsa_mongodb:/tmp/mongo_backup.gz "$BACKUP_DIR/mongo_${TIMESTAMP}.gz"
        log_success "MongoDB backup completado"
    else
        log_warning "MongoDB container no encontrado, saltando backup"
    fi

    # Backup uploads
    if [[ -d "$PROJECT_DIR/backend/uploads" ]]; then
        log "Backup uploads..."
        sudo tar -czf "$BACKUP_DIR/uploads_${TIMESTAMP}.tar.gz" -C "$PROJECT_DIR" backend/uploads
        log_success "Uploads backup completado"
    fi

    # Backup .env file
    if [[ -f "$SCRIPT_DIR/.env" ]]; then
        sudo cp "$SCRIPT_DIR/.env" "$BACKUP_DIR/env_${TIMESTAMP}.backup"
        log_success "Environment backup completado"
    fi

    # Clean old backups (keep last 7)
    sudo find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete
    sudo find "$BACKUP_DIR" -name "*.backup" -mtime +7 -delete

    log_success "Backup completado ✅"
}

stop_services() {
    log "Deteniendo servicios existentes..."

    cd "$SCRIPT_DIR"

    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        docker-compose -f docker-compose.prod.yml down
        log_success "Servicios detenidos"
    else
        log_warning "No hay servicios corriendo"
    fi
}

build_images() {
    log "Construyendo imágenes Docker..."

    cd "$SCRIPT_DIR"

    # Build backend
    log "Build backend..."
    docker-compose -f docker-compose.prod.yml build backend

    # Build frontend
    log "Build frontend..."
    docker-compose -f docker-compose.prod.yml build frontend

    log_success "Imágenes construidas ✅"
}

seed_database() {
    log "Poblando base de datos..."

    # Wait for backend to be ready
    log "Esperando que backend esté listo..."
    sleep 10

    # Run seed scripts
    if docker ps | grep -q vcsa_backend; then
        log "Ejecutando seed_coaching.py..."
        docker-compose -f docker-compose.prod.yml exec -T backend python seed_coaching.py || log_warning "seed_coaching.py falló o ya fue ejecutado"

        log "Ejecutando seed_knowledge_hub.py..."
        docker-compose -f docker-compose.prod.yml exec -T backend python seed_knowledge_hub.py || log_warning "seed_knowledge_hub.py falló o ya fue ejecutado"

        log "Ejecutando seed_branding.py..."
        docker-compose -f docker-compose.prod.yml exec -T backend python seed_branding.py || log_warning "seed_branding.py falló o ya fue ejecutado"

        log "Creando admin user..."
        docker-compose -f docker-compose.prod.yml exec -T backend python create_admin.py || log_warning "create_admin.py falló o admin ya existe"

        log_success "Base de datos poblada ✅"
    else
        log_error "Backend container no está corriendo"
        return 1
    fi
}

start_services() {
    log "Iniciando servicios..."

    cd "$SCRIPT_DIR"

    # Start services
    docker-compose -f docker-compose.prod.yml up -d

    # Wait for services to be healthy
    log "Esperando que servicios estén listos..."
    sleep 15

    # Check if all services are running
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Exit"; then
        log_error "Algunos servicios fallaron en iniciar"
        docker-compose -f docker-compose.prod.yml logs
        return 1
    fi

    log_success "Servicios iniciados ✅"
}

run_health_checks() {
    log "Ejecutando health checks..."

    # Check frontend
    if curl -sf http://localhost:3000 > /dev/null; then
        log_success "Frontend: OK ✅"
    else
        log_error "Frontend: FAILED ❌"
        return 1
    fi

    # Check backend
    if curl -sf http://localhost:8000/api/health > /dev/null; then
        log_success "Backend: OK ✅"
    else
        log_error "Backend: FAILED ❌"
        return 1
    fi

    # Check MongoDB
    if docker exec vcsa_mongodb mongosh --eval "db.stats()" > /dev/null 2>&1; then
        log_success "MongoDB: OK ✅"
    else
        log_error "MongoDB: FAILED ❌"
        return 1
    fi

    log_success "Todos los health checks pasaron ✅"
}

configure_nginx() {
    log "Configurando Nginx..."

    # Check if SSL certificates exist
    if [[ ! -f "$SCRIPT_DIR/nginx/ssl/fullchain.pem" ]]; then
        log_warning "SSL certificates no encontrados"
        log_warning "Genera certificados con: certbot --nginx"
        log_warning "O usa HTTP-only para testing"
    fi

    # Test Nginx configuration
    sudo docker exec vcsa_nginx nginx -t

    if [[ $? -eq 0 ]]; then
        sudo docker exec vcsa_nginx nginx -s reload
        log_success "Nginx configurado y recargado ✅"
    else
        log_error "Nginx configuration test failed"
        return 1
    fi
}

setup_monitoring() {
    log "Configurando monitoring..."

    # Create health check script
    sudo cat > /usr/local/bin/vcsa-health.sh << 'EOF'
#!/bin/bash

echo "Checking VCSA Services..."
echo "========================"

# Check services
docker ps --filter "name=vcsa" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "Health Checks:"
echo "============="

# Check frontend
if curl -sf http://localhost:3000 > /dev/null; then
    echo "✓ Frontend: OK"
else
    echo "✗ Frontend: FAILED"
fi

# Check backend
if curl -sf http://localhost:8000/api/health > /dev/null; then
    echo "✓ Backend: OK"
else
    echo "✗ Backend: FAILED"
fi

# Check MongoDB
if docker exec vcsa_mongodb mongosh --eval "db.stats()" > /dev/null 2>&1; then
    echo "✓ MongoDB: OK"
else
    echo "✗ MongoDB: FAILED"
fi

echo ""
echo "Disk Usage:"
df -h | grep -E "Filesystem|/dev/sda"

echo ""
echo "Memory Usage:"
free -h

echo ""
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}'
EOF

    sudo chmod +x /usr/local/bin/vcsa-health.sh

    # Setup cron for daily backup
    sudo cat > /tmp/vcsa-backup-cron << EOF
0 2 * * * /usr/local/bin/vcsa-backup.sh >> /var/log/vcsa-backup.log 2>&1
EOF

    sudo crontab -l 2>/dev/null | grep -v "vcsa-backup" | sudo tee /tmp/crontab-temp > /dev/null
    sudo cat /tmp/vcsa-backup-cron >> /tmp/crontab-temp
    sudo crontab /tmp/crontab-temp
    sudo rm /tmp/vcsa-backup-cron /tmp/crontab-temp

    log_success "Monitoring configurado ✅"
}

display_summary() {
    log "Deployment Summary"
    echo ""
    echo "=================================="
    echo "VCSA MVP Deployment Complete!"
    echo "=================================="
    echo ""
    echo "Services Running:"
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo "Access URLs:"
    echo "  Frontend: http://localhost (or https://your-domain.com)"
    echo "  Backend API: http://localhost:8000/api/health"
    echo "  API Docs: http://localhost:8000/docs"
    echo ""
    echo "Useful Commands:"
    echo "  View logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "  Stop: docker-compose -f docker-compose.prod.yml down"
    echo "  Restart: docker-compose -f docker-compose.prod.yml restart"
    echo "  Health check: /usr/local/bin/vcsa-health.sh"
    echo ""
    echo "Backup Location: $BACKUP_DIR"
    echo "Logs: /var/log/vcsa-deploy.log"
    echo ""
    log_success "Deployment completado exitosamente! 🚀"
}

rollback() {
    log_error "Iniciando rollback..."

    cd "$SCRIPT_DIR"

    # Stop current services
    docker-compose -f docker-compose.prod.yml down

    # Restore from backup
    if [[ -f "$BACKUP_DIR/mongo_${TIMESTAMP}.gz" ]]; then
        log "Restaurando MongoDB..."
        docker-compose -f docker-compose.prod.yml up -d mongodb
        sleep 10
        sudo docker cp "$BACKUP_DIR/mongo_${TIMESTAMP}.gz" vcsa_mongodb:/tmp/mongo_restore.gz
        sudo docker exec vcsa_mongodb mongorestore --archive=/tmp/mongo_restore.gz --gzip
    fi

    # Restore uploads
    if [[ -f "$BACKUP_DIR/uploads_${TIMESTAMP}.tar.gz" ]]; then
        log "Restaurando uploads..."
        sudo mkdir -p "$PROJECT_DIR/backend/uploads"
        sudo tar -xzf "$BACKUP_DIR/uploads_${TIMESTAMP}.tar.gz" -C "$PROJECT_DIR"
    fi

    # Restart services
    docker-compose -f docker-compose.prod.yml up -d

    log "Rollback completado. Verifica el estado de los servicios."
}

# Main deployment flow
main() {
    log "======================================"
    log "VCSA Production Deployment Script"
    log "Version: 1.0.0"
    log "Timestamp: $TIMESTAMP"
    log "======================================"
    echo ""

    # Check if rollback is requested
    if [[ "$1" == "rollback" ]]; then
        rollback
        exit 0
    fi

    # Deployment flow
    check_prerequisites
    create_backup
    stop_services
    build_images
    start_services

    # Seed database (only on first deploy or if requested)
    if [[ "$1" == "seed" ]] || [[ "$1" == "fresh" ]]; then
        seed_database
    fi

    run_health_checks

    if [[ $? -eq 0 ]]; then
        configure_nginx
        setup_monitoring
        display_summary
    else
        log_error "Health checks failed!"
        log_error "Puedes hacer rollback con: $0 rollback"
        exit 1
    fi
}

# Run main function with all arguments
main "$@"
