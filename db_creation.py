"""
Database initialization script with seed data.
Drops all tables, recreates schema, and seeds with initial data.
"""
from server.db.base import Base
from server.db.db_config import engine, SessionLocal
from server.db.schema import Archetype, Type, Faction


def init_database():
    """Drop all tables and recreate them."""
    print("=" * 60)
    print("DATABASE INITIALIZATION")
    print("=" * 60)
    
    print("\n[1/3] Dropping all existing tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("[2/3] Creating all tables with new schema...")
    Base.metadata.create_all(bind=engine)
    
    print("[3/3] Seeding initial data...")
    seed_data()
    
    print("\n" + "=" * 60)
    print("✅ Database initialization complete!")
    print("=" * 60)


def seed_data():
    """Seed the database with initial archetypes, types, and factions."""
    session = SessionLocal()
    
    try:
        # Seed Archetypes
        print("\n  → Creating Archetypes...")
        archetypes_data = [
            "Universelle",
            "Légions de Rôme",
            "Guerriers scandinaves",
            "Japon féodal",
            "Guerriers de Spartes",
        ]
        
        archetypes = {}
        for name in archetypes_data:
            archetype = Archetype(name=name)
            session.add(archetype)
            session.flush()  # Get the ID
            archetypes[name] = archetype.id
            print(f"    ✓ {name} (ID: {archetype.id})")
        
        # Seed Types
        print("\n  → Creating Types...")
        types_data = [
            "Bastion",
            "Combattant",
            "Structure",
            "Relique",
            "Institution",
            "Soutien",
            "Intervention",
            "Intervention immédiate",
        ]
        
        for name in types_data:
            type_obj = Type(name=name)
            session.add(type_obj)
            session.flush()
            print(f"    ✓ {name} (ID: {type_obj.id})")
        
        # Seed Factions
        print("\n  → Creating Factions...")
        factions_data = [
            ("Spartiate", "Guerriers de Spartes"),
            ("Légionnaire", "Légions de Rôme"),
            ("Ronin", "Japon féodal"),
            ("Bushi", "Japon féodal"),
            ("Viking", "Guerriers scandinaves"),
        ]
        
        for faction_name, archetype_name in factions_data:
            faction = Faction(
                name=faction_name,
                archetype_id=archetypes[archetype_name]
            )
            session.add(faction)
            session.flush()
            print(f"    ✓ {faction_name} → {archetype_name} (ID: {faction.id})")
        
        # Commit all changes
        session.commit()
        print("\n  ✅ All seed data created successfully!")
        
    except Exception as e:
        print(f"\n  ❌ Error seeding data: {e}")
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    init_database()