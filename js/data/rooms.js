/**
 * MARKIEZENHOF DATA
 * Contains information about each room/section in the Markiezenhof palace
 * Each room has: id, name, description, image, 3D position, and additional details
 */

export const ROOM_DATA = {
    "great-hall": {
        "id": "great-hall",
        "name": "Great Hall",
        "description": "The magnificent Great Hall (Grote Zaal) served as the main reception room for the Marquises of Bergen op Zoom. This impressive space features ornate 16th-century decorations, elaborate ceiling paintings, and serves as the ceremonial heart of the palace.",
        "image": "https://assets.plaece.nl/thumb/5hCpTf0B39wfTA7PXiCGkiZiDBHatdz_zPKGilP5Lqw/resizing_type:fit/width:650/height:366/gravity:sm/aHR0cHM6Ly9hc3NldHMucGxhZWNlLm5sL29kcC12aXNpdGJyYWJhbnQvaW1hZ2UvbWFya2llemVuaG9mLWhvZnphYWwtMV8xOTYyODk0NzA1LmpwZw.jpg",
        "position": { "x": -5, "y": 0.5, "z": -9 },
        "details": {
            "period": "16th Century",
            "area": "180 m²",
            "specialty": "Renaissance Architecture"
        }
    },
    "kitchen-quarters": {
        "id": "kitchen-quarters",
        "name": "Historic Kitchen",
        "description": "The medieval kitchen quarters showcase the daily life and culinary practices of the palace. Complete with original fireplaces, cooking utensils, and ceramic collections, this area provides insight into 15th and 16th-century domestic life.",
        "image": "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=800&q=80",
        "position": { "x": -8, "y": 0.5, "z": 2 },
        "details": {
            "period": "15th-16th Century",
            "area": "120 m²",
            "specialty": "Medieval Domestic Life"
        }
    },
    "chapel": {
        "id": "chapel",
        "name": "Palace Chapel",
        "description": "The intimate palace chapel features stunning late-Gothic architecture with intricate stone carvings and stained glass windows. This sacred space was used for private worship by the Marquises and their household, showcasing religious art and devotional objects.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Chapel_of_Markiezenhof_%282%29.jpg",
        "position": { "x": 6, "y": 0.5, "z": 0 },
        "details": {
            "period": "Late Gothic (15th Century)",
            "area": "85 m²",
            "specialty": "Religious Art & Architecture"
        }
    },
    "exhibition-gallery": {
        "id": "exhibition-gallery",
        "name": "Exhibition Gallery",
        "description": "The modern exhibition gallery hosts rotating displays of regional history, archaeological findings, and contemporary art exhibitions. This versatile space bridges the palace's historic past with modern cultural presentations.",
        "image": "https://www.fijnuit.nl/images/bedrijven/1838-het-markiezenhof/markiezenhof-blauwe-zaal.jpg",
        "position": { "x": -6, "y": 0.5, "z": -5 },
        "details": {
            "period": "Contemporary Use",
            "area": "200 m²",
            "specialty": "Temporary Exhibitions"
        }
    },
    "city-museum": {
        "id": "city-museum",
        "name": "City Museum",
        "description": "The city museum section documents the rich history of Bergen op Zoom from medieval times to the present. Interactive displays, historical artifacts, and multimedia presentations tell the story of this strategic fortress city and its cultural heritage.",
        "image": "https://cdn.museum.nl/assets/ed69abd1-c80a-4ff3-a8f1-c216a2e6f28e?w=3000&c=ca7f8477325c0dc4d206bee0fabf596e8dde3b199cb02c7c86a276e38520b7e3",
        "position": { "x": 0, "y": 0.5, "z": 0 },
        "details": {
            "period": "12th-21st Century",
            "area": "350 m²",
            "specialty": "Local History & Heritage"
        }
    }
};