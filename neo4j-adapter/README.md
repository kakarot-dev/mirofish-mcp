# Neo4j Adapter for MiroFish

Drop-in replacement for Zep Cloud in MiroFish's backend.

## What this does

MiroFish uses Zep Cloud for knowledge graph storage. This adapter provides
the same interface using a self-hosted Neo4j instance, eliminating the
external cloud dependency.

## How to use

1. Copy `neo4j_graph_adapter.py` and `graph_storage_factory.py` into
   `MiroFish/backend/app/services/`
2. Set environment variables:
   ```
   USE_NEO4J=true
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_password
   ```
3. The factory will automatically route all graph operations to Neo4j.

## Migration from Zep

See `MIGRATION.md` for the step-by-step migration guide.
