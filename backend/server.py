from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import uuid
from datetime import datetime
import re

app = FastAPI(title="iPad-Hilfe API", description="Modern FAQ API for iPad Help App")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
try:
    MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = MongoClient(MONGO_URL)
    db = client.ipad_hilfe
    faq_collection = db.faq_items
    preferences_collection = db.user_preferences
    print(f"Connected to MongoDB at: {MONGO_URL}")
except Exception as e:
    print(f"MongoDB connection error: {e}")

# Pydantic models
class FAQItem(BaseModel):
    id: str
    question: str
    answer: str
    category: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class UserPreferences(BaseModel):
    user_id: str
    has_seen_intro: bool = False
    favorites: List[str] = []
    theme: str = "light"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class CategoryInfo(BaseModel):
    name: str
    icon: str
    description: str
    count: int

# FAQ Data - Original German content from Swift app
FAQ_DATA = [
    {
        "id": "8e678d11-9107-4ecf-ad81-34f9ec663d94",
        "question": "Wie erstelle ich eine Apple-ID nur für die Schule?",
        "answer": "1. Gehe zu 'Einstellungen' > 'Bei Apple-ID anmelden'\n2. Tippe auf 'Neue Apple-ID erstellen'\n3. Verwende deine Schul-E-Mail-Adresse\n4. Wähle ein sicheres Passwort (mindestens 8 Zeichen)\n5. Bestätige deine E-Mail-Adresse über den Link\n6. Aktiviere die Zwei-Faktor-Authentifizierung für zusätzliche Sicherheit\n\nTipp: Verwende diese Apple-ID nur für schulische Zwecke und teile deine Anmeldedaten niemals mit anderen.",
        "category": "Erste Schritte"
    },
    {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "question": "Wie verbinde ich mich mit dem Heim-WLAN?",
        "answer": "1. Öffne 'Einstellungen' > 'WLAN'\n2. Stelle sicher, dass WLAN aktiviert ist\n3. Wähle dein Heimnetzwerk aus der Liste\n4. Gib das WLAN-Passwort ein\n5. Tippe auf 'Verbinden'\n6. Ein Häkchen zeigt erfolgreiche Verbindung an\n\nBei Problemen: Setze die Netzwerkeinstellungen zurück unter 'Einstellungen' > 'Allgemein' > 'iPad übertragen/zurücksetzen' > 'Zurücksetzen' > 'Netzwerkeinstellungen'.",
        "category": "Erste Schritte"
    },
    {
        "id": "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
        "question": "Wie mache ich Screenshots und Bildschirmaufnahmen?",
        "answer": "**Screenshot:**\n1. Drücke gleichzeitig die Ein-/Aus-Taste und die Lauter-Taste\n2. Das Bild erscheint kurz in der Ecke\n3. Tippe darauf für Bearbeitungsoptionen oder wische weg zum Speichern\n\n**Bildschirmaufnahme:**\n1. Füge 'Bildschirmaufnahme' zum Kontrollzentrum hinzu: Einstellungen > Kontrollzentrum\n2. Wische vom rechten oberen Rand nach unten\n3. Tippe den runden Aufnahme-Button\n4. Warte 3 Sekunden, dann beginnt die Aufnahme\n5. Tippe die rote Statusleiste zum Stoppen",
        "category": "Erste Schritte"
    },
    {
        "id": "693ab7b3-621b-4a09-b991-f6e8f278bcf2",
        "question": "Wie nutze ich GoodNotes für Arbeitsblätter?",
        "answer": "1. **PDF importieren:** Tippe '+' > 'Importieren' > wähle dein Arbeitsblatt\n2. **Schreibwerkzeuge:** Nutze Stift, Marker oder Text-Tool aus der Symbolleiste\n3. **Handschrift:** Schreibe direkt auf das PDF mit dem Apple Pencil\n4. **Text hinzufügen:** Tippe 'T' und tippe an gewünschte Stelle\n5. **Lasso-Tool:** Markiere und verschiebe Inhalte\n6. **Speichern:** Automatisch gespeichert, exportiere über Teilen-Button\n\nTipp: Erstelle separate Ordner für jedes Fach und nutze aussagekräftige Namen für deine Notizen.",
        "category": "Apps & Tools"
    },
    {
        "id": "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
        "question": "Wie organisiere ich Seiten in Pages?",
        "answer": "**Neue Seite einfügen:**\n1. Tippe '+' oben links\n2. Wähle 'Seitenumbruch' oder Vorlage\n\n**Seiten verwalten:**\n1. Tippe das Seiten-Symbol (links oben)\n2. Ziehe Seiten zum Umordnen\n3. Tippe Seite an und wähle 'Löschen' falls nötig\n\n**Layout anpassen:**\n1. Tippe 'Format' (Pinsel-Symbol)\n2. Wähle 'Layout' für Ränder und Spalten\n3. Nutze 'Absatz' für Textformatierung\n\nTipp: Verwende Vorlagen für einheitliches Design und erstelle eigene Vorlagen für wiederkehrende Dokumente.",
        "category": "Apps & Tools"
    }
]

# Category configuration
CATEGORIES = [
    {"name": "Erste Schritte", "icon": "play-circle", "description": "Grundlagen für den Start"},
    {"name": "Apps & Tools", "icon": "grid-3x3-gap", "description": "Wichtige Apps und Werkzeuge"},
    {"name": "Troubleshooting", "icon": "tools", "description": "Probleme lösen"},
    {"name": "Dateien & Organisation", "icon": "folder", "description": "Ordnung in deinen Dateien"},
    {"name": "Kommunikation & Zusammenarbeit", "icon": "people", "description": "Teamwork und Austausch"},
    {"name": "Sicherheit & Verantwortung", "icon": "shield-check", "description": "Sicher und verantwortlich"},
    {"name": "Tipps & Tricks", "icon": "lightbulb", "description": "Profi-Tipps für Fortgeschrittene"},
    {"name": "Multimedia & Projekte", "icon": "play-btn", "description": "Kreative Projekte"}
]

@app.on_event("startup")
async def startup_event():
    """Initialize database with FAQ data if empty"""
    try:
        # Check if FAQ data exists
        if faq_collection.count_documents({}) == 0:
            print("Initializing FAQ database with sample data...")
            for item in FAQ_DATA:
                item["created_at"] = datetime.now()
                item["updated_at"] = datetime.now()
            faq_collection.insert_many(FAQ_DATA)
            print(f"Inserted {len(FAQ_DATA)} FAQ items")
        else:
            print(f"FAQ database already contains {faq_collection.count_documents({})} items")
    except Exception as e:
        print(f"Database initialization error: {e}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db.command("ping")
        return {"status": "healthy", "database": "connected", "timestamp": datetime.now()}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e), "timestamp": datetime.now()}

@app.get("/api/categories", response_model=List[CategoryInfo])
async def get_categories():
    """Get all FAQ categories with item counts"""
    try:
        categories_with_counts = []
        for category in CATEGORIES:
            count = faq_collection.count_documents({"category": category["name"]})
            categories_with_counts.append(CategoryInfo(
                name=category["name"],
                icon=category["icon"],
                description=category["description"],
                count=count
            ))
        return categories_with_counts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

@app.get("/api/faq", response_model=List[FAQItem])
async def get_faq_items(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in questions and answers"),
    limit: int = Query(100, description="Maximum number of items to return")
):
    """Get FAQ items with optional filtering and search"""
    try:
        # Build query
        query = {}
        if category:
            query["category"] = category
        
        # Execute query
        cursor = faq_collection.find(query).limit(limit)
        items = list(cursor)
        
        # Convert MongoDB _id to string and remove it
        for item in items:
            item.pop("_id", None)
        
        # Apply search filter if provided
        if search:
            search_lower = search.lower()
            items = [
                item for item in items
                if search_lower in item["question"].lower() or search_lower in item["answer"].lower()
            ]
        
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching FAQ items: {str(e)}")

@app.get("/api/faq/{faq_id}", response_model=FAQItem)
async def get_faq_item(faq_id: str):
    """Get a specific FAQ item by ID"""
    try:
        item = faq_collection.find_one({"id": faq_id})
        if not item:
            raise HTTPException(status_code=404, detail="FAQ item not found")
        
        item.pop("_id", None)
        return item
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching FAQ item: {str(e)}")

@app.get("/api/search", response_model=List[FAQItem])
async def search_faq(
    q: str = Query(..., description="Search query"),
    limit: int = Query(20, description="Maximum number of results")
):
    """Advanced search in FAQ items"""
    try:
        if not q or len(q.strip()) < 2:
            return []
        
        search_query = q.strip().lower()
        
        # Get all items for search
        cursor = faq_collection.find({})
        items = list(cursor)
        
        # Remove MongoDB _id
        for item in items:
            item.pop("_id", None)
        
        # Score and sort results
        scored_results = []
        for item in items:
            score = 0
            question_lower = item["question"].lower()
            answer_lower = item["answer"].lower()
            
            # Exact phrase match gets highest score
            if search_query in question_lower:
                score += 10
            if search_query in answer_lower:
                score += 5
            
            # Word matches
            search_words = search_query.split()
            for word in search_words:
                if word in question_lower:
                    score += 3
                if word in answer_lower:
                    score += 1
            
            if score > 0:
                scored_results.append((item, score))
        
        # Sort by score and return top results
        scored_results.sort(key=lambda x: x[1], reverse=True)
        return [item for item, _ in scored_results[:limit]]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

@app.get("/api/preferences/{user_id}", response_model=UserPreferences)
async def get_user_preferences(user_id: str):
    """Get user preferences"""
    try:
        prefs = preferences_collection.find_one({"user_id": user_id})
        if not prefs:
            # Create default preferences
            default_prefs = {
                "user_id": user_id,
                "has_seen_intro": False,
                "favorites": [],
                "theme": "light",
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            preferences_collection.insert_one(default_prefs)
            default_prefs.pop("_id", None)
            return default_prefs
        
        prefs.pop("_id", None)
        return prefs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching preferences: {str(e)}")

@app.put("/api/preferences/{user_id}")
async def update_user_preferences(user_id: str, preferences: UserPreferences):
    """Update user preferences"""
    try:
        prefs_dict = preferences.dict()
        prefs_dict["updated_at"] = datetime.now()
        
        result = preferences_collection.update_one(
            {"user_id": user_id},
            {"$set": prefs_dict},
            upsert=True
        )
        
        return {"success": True, "modified": result.modified_count > 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating preferences: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)