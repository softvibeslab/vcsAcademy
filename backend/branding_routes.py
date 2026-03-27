"""
Branding Configuration Routes
CRUD API para gestionar la configuración de branding y temas
"""
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

# Router
branding_router = APIRouter(prefix="/api/branding", tags=["branding"])

# ============== MODELS ==============

class BrandingColors(BaseModel):
    """Configuración de colores"""
    primary: str = "#D4AF37"
    secondary: str = "#1E3A8A"
    accent: str = "#F59E0B"
    background: str = "#020204"
    card_background: str = "#0A0A0B"
    text_main: str = "#F8FAFC"
    text_muted: str = "#94A3B8"

class BrandingImages(BaseModel):
    """Configuración de imágenes y logos"""
    logo_url: Optional[str] = "/logo.png"
    logo_dark_url: Optional[str] = "/logo-dark.png"
    favicon_url: Optional[str] = "/favicon.ico"
    hero_background: Optional[str] = None
    login_background: Optional[str] = None

class BrandingTypography(BaseModel):
    """Configuración de tipografía"""
    font_heading: str = "Playfair Display"
    font_body: str = "DM Sans"
    font_mono: str = "JetBrains Mono"

class BrandingTexts(BaseModel):
    """Textos de marca"""
    site_name: str = "Vacation Club Sales Academy"
    tagline: str = "The Performance Operating System for Vacation Club Sales Teams"
    site_description: str = "Premium sales training platform for vacation club professionals"

class BrandingUIConfig(BaseModel):
    """Configuración de UI"""
    border_radius: str = "0"
    button_style: str = "sharp"  # sharp, rounded, pill
    card_style: str = "glass"  # flat, elevated, glass
    animation_level: str = "normal"  # none, minimal, normal, high

class BrandingGradients(BaseModel):
    """Configuración de gradientes"""
    primary_gradient: str = "linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)"
    secondary_gradient: str = "linear-gradient(180deg, #020204 0%, #0F172A 100%)"

class BrandingSocial(BaseModel):
    """Configuración de redes sociales"""
    facebook_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    youtube_url: Optional[str] = None

class BrandingAdvanced(BaseModel):
    """Configuración avanzada"""
    custom_css: str = ""
    head_scripts: str = ""
    body_scripts: str = ""

class BrandingConfig(BaseModel):
    """Configuración completa de branding"""
    model_config = ConfigDict(extra="ignore")

    config_id: Optional[str] = None
    name: str = "Default Branding"
    is_active: bool = False

    colors: BrandingColors = Field(default_factory=BrandingColors)
    images: BrandingImages = Field(default_factory=BrandingImages)
    typography: BrandingTypography = Field(default_factory=BrandingTypography)
    texts: BrandingTexts = Field(default_factory=BrandingTexts)
    ui_config: BrandingUIConfig = Field(default_factory=BrandingUIConfig)
    gradients: BrandingGradients = Field(default_factory=BrandingGradients)
    social: BrandingSocial = Field(default_factory=BrandingSocial)
    advanced: BrandingAdvanced = Field(default_factory=BrandingAdvanced)

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None

class BrandingConfigUpdate(BaseModel):
    """Modelo para actualizar configuración (todos campos opcionales)"""
    name: Optional[str] = None
    is_active: Optional[bool] = None
    colors: Optional[BrandingColors] = None
    images: Optional[BrandingImages] = None
    typography: Optional[BrandingTypography] = None
    texts: Optional[BrandingTexts] = None
    ui_config: Optional[BrandingUIConfig] = None
    gradients: Optional[BrandingGradients] = None
    social: Optional[BrandingSocial] = None
    advanced: Optional[BrandingAdvanced] = None

# ============== DEPENDENCY ==============

async def get_db():
    """Dependency para obtener la base de datos"""
    from server import db
    return db

# ============== ROUTES ==============

@branding_router.get("/config", response_model=Dict[str, Any])
async def get_active_branding(db=Depends(get_db)):
    """
    Obtiene la configuración de branding activa
    Si no hay ninguna activa, retorna la configuración por defecto
    """
    try:
        # Buscar configuración activa
        active_config = await db.branding_configs.find_one({"is_active": True})

        if active_config:
            # Convertir ObjectId a string
            active_config["config_id"] = str(active_config.pop("_id"))
            logger.info("Active branding config retrieved")
            return {
                "success": True,
                "data": active_config,
                "is_default": False
            }

        # Retornar configuración por defecto
        default_config = BrandingConfig(name="Default Branding", is_active=True)
        logger.info("No active branding found, returning default")
        return {
            "success": True,
            "data": default_config.model_dump(),
            "is_default": True
        }

    except Exception as e:
        logger.error(f"Error fetching active branding: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching branding configuration"
        )

@branding_router.get("/config/all", response_model=Dict[str, Any])
async def get_all_branding_configs(
    skip: int = 0,
    limit: int = 20,
    db=Depends(get_db)
):
    """Obtiene todas las configuraciones de branding (paginado)"""
    try:
        cursor = db.branding_configs.find().skip(skip).limit(limit)
        configs = await cursor.to_list(length=limit)

        # Convertir ObjectIds a strings
        for config in configs:
            config["config_id"] = str(config.pop("_id"))

        total = await db.branding_configs.count_documents({})

        return {
            "success": True,
            "data": configs,
            "total": total,
            "skip": skip,
            "limit": limit
        }

    except Exception as e:
        logger.error(f"Error fetching branding configs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching branding configurations"
        )

@branding_router.get("/config/{config_id}", response_model=Dict[str, Any])
async def get_branding_config(config_id: str, db=Depends(get_db)):
    """Obtiene una configuración específica por ID"""
    try:
        from bson import ObjectId

        if not ObjectId.is_valid(config_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid config ID format"
            )

        config = await db.branding_configs.find_one({"_id": ObjectId(config_id)})

        if not config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Branding configuration not found"
            )

        config["config_id"] = str(config.pop("_id"))

        return {
            "success": True,
            "data": config
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching branding config: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching branding configuration"
        )

@branding_router.post("/config", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_branding_config(
    config: BrandingConfig,
    user_id: Optional[str] = None,
    db=Depends(get_db)
):
    """Crea una nueva configuración de branding"""
    try:
        # Si esta configuración es activa, desactivar las demás
        if config.is_active:
            await db.branding_configs.update_many(
                {"is_active": True},
                {"$set": {"is_active": False}}
            )

        # Crear documento
        config_dict = config.model_dump(exclude={"config_id", "created_at", "updated_at"})
        config_dict["created_at"] = datetime.now(timezone.utc)
        config_dict["updated_at"] = datetime.now(timezone.utc)

        if user_id:
            config_dict["created_by"] = user_id

        result = await db.branding_configs.insert_one(config_dict)

        # Recuperar el documento creado
        created_config = await db.branding_configs.find_one({"_id": result.inserted_id})
        created_config["config_id"] = str(created_config.pop("_id"))

        logger.info(f"Branding config created: {result.inserted_id}")

        return {
            "success": True,
            "data": created_config,
            "message": "Branding configuration created successfully"
        }

    except Exception as e:
        logger.error(f"Error creating branding config: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating branding configuration"
        )

@branding_router.put("/config/{config_id}", response_model=Dict[str, Any])
async def update_branding_config(
    config_id: str,
    update_data: BrandingConfigUpdate,
    db=Depends(get_db)
):
    """Actualiza una configuración de branding existente"""
    try:
        from bson import ObjectId

        if not ObjectId.is_valid(config_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid config ID format"
            )

        # Si se está activando esta configuración, desactivar las demás
        if update_data.is_active is True:
            await db.branding_configs.update_many(
                {"_id": {"$ne": ObjectId(config_id)}, "is_active": True},
                {"$set": {"is_active": False}}
            )

        # Preparar actualización (solo campos no nulos)
        update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}

        if update_dict:
            update_dict["updated_at"] = datetime.now(timezone.utc)

            result = await db.branding_configs.update_one(
                {"_id": ObjectId(config_id)},
                {"$set": update_dict}
            )

            if result.matched_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Branding configuration not found"
                )

        # Recuperar configuración actualizada
        updated_config = await db.branding_configs.find_one({"_id": ObjectId(config_id)})
        updated_config["config_id"] = str(updated_config.pop("_id"))

        logger.info(f"Branding config updated: {config_id}")

        return {
            "success": True,
            "data": updated_config,
            "message": "Branding configuration updated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating branding config: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating branding configuration"
        )

@branding_router.delete("/config/{config_id}", response_model=Dict[str, Any])
async def delete_branding_config(config_id: str, db=Depends(get_db)):
    """Elimina una configuración de branding"""
    try:
        from bson import ObjectId

        if not ObjectId.is_valid(config_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid config ID format"
            )

        result = await db.branding_configs.delete_one({"_id": ObjectId(config_id)})

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Branding configuration not found"
            )

        logger.info(f"Branding config deleted: {config_id}")

        return {
            "success": True,
            "message": "Branding configuration deleted successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting branding config: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting branding configuration"
        )

@branding_router.post("/config/{config_id}/activate", response_model=Dict[str, Any])
async def activate_branding_config(config_id: str, db=Depends(get_db)):
    """Activa una configuración específica (desactiva las demás)"""
    try:
        from bson import ObjectId

        if not ObjectId.is_valid(config_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid config ID format"
            )

        # Verificar que existe
        config = await db.branding_configs.find_one({"_id": ObjectId(config_id)})
        if not config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Branding configuration not found"
            )

        # Desactivar todas las demás
        await db.branding_configs.update_many(
            {"is_active": True},
            {"$set": {"is_active": False}}
        )

        # Activar esta
        await db.branding_configs.update_one(
            {"_id": ObjectId(config_id)},
            {"$set": {"is_active": True, "updated_at": datetime.now(timezone.utc)}}
        )

        logger.info(f"Branding config activated: {config_id}")

        return {
            "success": True,
            "message": "Branding configuration activated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error activating branding config: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error activating branding configuration"
        )

@branding_router.post("/config/seed-default", response_model=Dict[str, Any])
async def seed_default_branding(db=Depends(get_db)):
    """Crea la configuración por defecto si no existe ninguna"""
    try:
        # Verificar si ya existe configuración
        existing = await db.branding_configs.find_one({"is_active": True})

        if existing:
            return {
                "success": True,
                "message": "Default branding already exists",
                "data": {"config_id": str(existing["_id"])}
            }

        # Crear configuración por defecto
        default_config = BrandingConfig(
            name="Default Branding",
            is_active=True
        )

        config_dict = default_config.model_dump(exclude={"config_id", "created_at", "updated_at"})
        config_dict["created_at"] = datetime.now(timezone.utc)
        config_dict["updated_at"] = datetime.now(timezone.utc)
        config_dict["created_by"] = "system"

        result = await db.branding_configs.insert_one(config_dict)

        logger.info(f"Default branding config seeded: {result.inserted_id}")

        return {
            "success": True,
            "message": "Default branding configuration created",
            "data": {"config_id": str(result.inserted_id)}
        }

    except Exception as e:
        logger.error(f"Error seeding default branding: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating default branding configuration"
        )
