"""
Database initialization script with seed data.
Creates all tables and seeds the database with the "Universelle" archetype and basic presets.
"""
from server.db.base import Base
from server.db.db_config import engine, SessionLocal
from server.db.schema import (
    Archetype,
    Type,
    Faction,
    EffectType,
    Effect,
    Bonus,
    Illustration,
    Card,
    Deck,
)

def init_database():
    """Drop all tables and recreate them."""
    print("Dropping all existing tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Database tables created successfully!")


def seed_data():
    """Seed the database with initial data."""
    print("\nSeeding database with initial data...")
    
    with SessionLocal() as session:
        # Create the "Universelle" archetype
        universelle = Archetype(name="Universelle")
        session.add(universelle)
        session.commit()
        session.refresh(universelle)
        print(f"✓ Created archetype: {universelle.name} (ID: {universelle.id})")
        
        # Create some basic card types (not archetype-specific)
        types_data = ["Personnage", "Sort", "Objet", "Lieu", "Événement"]
        types = []
        for type_name in types_data:
            card_type = Type(name=type_name)
            session.add(card_type)
            types.append(card_type)
        session.commit()
        print(f"✓ Created {len(types)} card types")
        
        # Create some factions for Universelle archetype
        factions_data = ["Neutre", "Gardiens", "Rebelles", "Marchands"]
        factions = []
        for faction_name in factions_data:
            faction = Faction(name=faction_name, archetype_id=universelle.id)
            session.add(faction)
            factions.append(faction)
        session.commit()
        print(f"✓ Created {len(factions)} factions for Universelle")
        
        # Create some effect types
        effect_types_data = ["Buff", "Debuff", "Contrôle", "Dégâts", "Soin", "Utilitaire"]
        effect_types = []
        for effect_type_name in effect_types_data:
            effect_type = EffectType(name=effect_type_name)
            session.add(effect_type)
            effect_types.append(effect_type)
        session.commit()
        print(f"✓ Created {len(effect_types)} effect types")
        
        # Create some sample effects for Universelle
        effects_data = [
            {
                "name": "Pioche de cartes",
                "description": "Piochez 2 cartes supplémentaires à votre prochain tour",
                "effect_type_id": effect_types[5].id  # Utilitaire
            },
            {
                "name": "Dégâts directs",
                "description": "Inflige 3 points de dégâts à une cible",
                "effect_type_id": effect_types[3].id  # Dégâts
            },
            {
                "name": "Bouclier",
                "description": "Gagne 5 points de résilience temporaire",
                "effect_type_id": effect_types[0].id  # Buff
            },
        ]
        effects = []
        for effect_data in effects_data:
            effect = Effect(
                name=effect_data["name"],
                description=effect_data["description"],
                archetype_id=universelle.id,
                effect_type_id=effect_data["effect_type_id"]
            )
            session.add(effect)
            effects.append(effect)
        session.commit()
        print(f"✓ Created {len(effects)} sample effects for Universelle")
        
        # Create some sample bonuses for Universelle
        bonuses_data = [
            "Bonus de combat : +2 en puissance de combat",
            "Réduction de coût : -1 au coût d'invocation",
            "Résistance : +3 en résilience",
        ]
        bonuses = []
        for bonus_desc in bonuses_data:
            bonus = Bonus(description=bonus_desc, archetype_id=universelle.id)
            session.add(bonus)
            bonuses.append(bonus)
        session.commit()
        print(f"✓ Created {len(bonuses)} sample bonuses for Universelle")
        
        print("\n✅ Database seeded successfully!")
        print(f"\nSummary:")
        print(f"  - 1 Archetype (Universelle)")
        print(f"  - {len(types)} Card Types")
        print(f"  - {len(factions)} Factions")
        print(f"  - {len(effect_types)} Effect Types")
        print(f"  - {len(effects)} Effects")
        print(f"  - {len(bonuses)} Bonuses")
        print(f"\nYou can now:")
        print(f"  1. Create additional archetypes via the Presets page")
        print(f"  2. Add archetype-specific factions, effects, and bonuses")
        print(f"  3. Upload illustrations for each archetype")
        print(f"  4. Create cards and decks")


if __name__ == "__main__":
    print("=" * 60)
    print("  AscendanceV2 - Database Initialization & Seeding")
    print("=" * 60)
    
    init_database()
    seed_data()
    
    print("\n" + "=" * 60)
    print("  Setup Complete! Start your server with: uv run python main.py")
    print("=" * 60)
