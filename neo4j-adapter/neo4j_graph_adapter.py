"""
Neo4j Graph Adapter — Drop-in replacement for Zep Cloud SDK.

Provides the same interface that MiroFish's services expect from the Zep client,
but backed by self-hosted Neo4j. This eliminates the Zep Cloud dependency.

Usage:
    from neo4j_graph_adapter import Neo4jGraphClient
    client = Neo4jGraphClient(uri="bolt://localhost:7687", user="neo4j", password="...")
    # Use client.graph.create(), client.graph.search(), etc. — same API as Zep
"""

import os
import uuid
import json
import logging
from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional, Callable
from datetime import datetime

from neo4j import GraphDatabase, Driver

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Data classes matching Zep SDK shapes
# ---------------------------------------------------------------------------

@dataclass
class GraphNode:
    uuid_: str = ""
    name: str = ""
    labels: List[str] = field(default_factory=list)
    summary: str = ""
    attributes: Dict[str, Any] = field(default_factory=dict)
    created_at: Optional[str] = None


@dataclass
class GraphEdge:
    uuid_: str = ""
    name: str = ""
    fact: str = ""
    source_node_uuid: str = ""
    target_node_uuid: str = ""
    fact_type: Optional[str] = None
    created_at: Optional[str] = None


@dataclass
class EpisodeData:
    """Matches zep_cloud.EpisodeData"""
    text: str = ""
    source: str = "text"
    source_description: str = ""


@dataclass
class SearchResult:
    """Matches Zep graph search result"""
    nodes: List[GraphNode] = field(default_factory=list)
    edges: List[GraphEdge] = field(default_factory=list)
    facts: List[str] = field(default_factory=list)


@dataclass
class EpisodeResult:
    uuid_: str = ""
    status: str = "processed"


# ---------------------------------------------------------------------------
# Node operations (matches client.graph.node.*)
# ---------------------------------------------------------------------------

class NodeOps:
    def __init__(self, driver: Driver):
        self._driver = driver

    def get(self, uuid_: str) -> GraphNode:
        query = """
        MATCH (n:Entity {uuid_: $uuid})
        RETURN n
        """
        with self._driver.session() as session:
            result = session.run(query, uuid=uuid_)
            record = result.single()
            if not record:
                raise ValueError(f"Node not found: {uuid_}")
            node = record[0]
            return GraphNode(
                uuid_=node.get("uuid_", ""),
                name=node.get("name", ""),
                labels=[l for l in node.labels if l != "Entity"],
                summary=node.get("summary", ""),
                attributes=json.loads(node.get("attributes", "{}")),
                created_at=str(node.get("created_at", "")),
            )

    def get_entity_edges(self, node_uuid: str) -> List[GraphEdge]:
        query = """
        MATCH (n:Entity {uuid_: $uuid})-[r]-(other:Entity)
        RETURN r, startNode(r).uuid_ as source, endNode(r).uuid_ as target
        """
        edges = []
        with self._driver.session() as session:
            result = session.run(query, uuid=node_uuid)
            for record in result:
                rel = record[0]
                edges.append(GraphEdge(
                    uuid_=rel.get("uuid_", ""),
                    name=rel.get("name", rel.type),
                    fact=rel.get("fact", ""),
                    source_node_uuid=record["source"],
                    target_node_uuid=record["target"],
                    fact_type=rel.get("fact_type", rel.type),
                    created_at=str(rel.get("created_at", "")),
                ))
        return edges


# ---------------------------------------------------------------------------
# Episode operations (matches client.graph.episode.*)
# ---------------------------------------------------------------------------

class EpisodeOps:
    def __init__(self, driver: Driver):
        self._driver = driver

    def get(self, uuid_: str) -> EpisodeResult:
        query = """
        MATCH (e:Episode {uuid_: $uuid})
        RETURN e
        """
        with self._driver.session() as session:
            result = session.run(query, uuid=uuid_)
            record = result.single()
            if not record:
                return EpisodeResult(uuid_=uuid_, status="not_found")
            node = record[0]
            return EpisodeResult(
                uuid_=node.get("uuid_", uuid_),
                status=node.get("status", "processed"),
            )


# ---------------------------------------------------------------------------
# Graph operations (matches client.graph.*)
# ---------------------------------------------------------------------------

class GraphOps:
    def __init__(self, driver: Driver):
        self._driver = driver
        self.node = NodeOps(driver)
        self.episode = EpisodeOps(driver)

    def create(self, graph_id: str, name: str = "", description: str = "", **kwargs) -> str:
        query = """
        MERGE (g:Graph {id: $graph_id})
        SET g.name = $name, g.description = $description, g.created_at = datetime()
        RETURN g.id
        """
        with self._driver.session() as session:
            result = session.run(query, graph_id=graph_id, name=name, description=description)
            return result.single()[0]

    def delete(self, graph_id: str) -> None:
        query = """
        MATCH (n {graph_id: $graph_id})
        DETACH DELETE n
        """
        with self._driver.session() as session:
            session.run(query, graph_id=graph_id)

    def set_ontology(self, graph_id: str, ontology: Any, **kwargs) -> None:
        ont_json = json.dumps(ontology) if not isinstance(ontology, str) else ontology
        query = """
        MERGE (o:Ontology {graph_id: $graph_id})
        SET o.definition = $ontology, o.updated_at = datetime()
        """
        with self._driver.session() as session:
            session.run(query, graph_id=graph_id, ontology=ont_json)

    def add(self, graph_id: str, data: str, **kwargs) -> str:
        """Add a single text episode to the graph (used by memory updater)."""
        ep_uuid = f"ep_{uuid.uuid4().hex[:16]}"
        query = """
        CREATE (e:Episode {
            uuid_: $uuid, graph_id: $graph_id,
            text: $text, status: 'pending', created_at: datetime()
        })
        RETURN e.uuid_
        """
        with self._driver.session() as session:
            result = session.run(query, uuid=ep_uuid, graph_id=graph_id, text=data)
            return result.single()[0]

    def add_batch(self, graph_id: str, episodes: List[Any], **kwargs) -> List[str]:
        """
        Add batch of text episodes. Matches Zep's add_batch.
        episodes: list of EpisodeData or dicts with 'text' field.
        """
        ep_uuids = []
        with self._driver.session() as session:
            for ep in episodes:
                text = ep.text if hasattr(ep, "text") else (ep.get("text", str(ep)) if isinstance(ep, dict) else str(ep))
                ep_uuid = f"ep_{uuid.uuid4().hex[:16]}"
                session.run(
                    """
                    CREATE (e:Episode {
                        uuid_: $uuid, graph_id: $graph_id,
                        text: $text, status: 'pending', created_at: datetime()
                    })
                    """,
                    uuid=ep_uuid, graph_id=graph_id, text=text,
                )
                ep_uuids.append(ep_uuid)
        return ep_uuids

    def search(
        self,
        graph_id: str,
        query: str,
        limit: int = 10,
        search_type: str = "similarity",
        **kwargs,
    ) -> SearchResult:
        """
        Search the graph. Supports full-text search on node names/summaries
        and edge facts.
        """
        nodes = []
        edges = []
        facts = []

        # Search nodes
        node_query = """
        CALL db.index.fulltext.queryNodes("entity_fulltext", $query) YIELD node, score
        WHERE node.graph_id = $graph_id
        RETURN node, score
        ORDER BY score DESC
        LIMIT $limit
        """
        try:
            with self._driver.session() as session:
                result = session.run(node_query, query=query, graph_id=graph_id, limit=limit)
                for record in result:
                    n = record[0]
                    nodes.append(GraphNode(
                        uuid_=n.get("uuid_", ""),
                        name=n.get("name", ""),
                        labels=[l for l in n.labels if l != "Entity"],
                        summary=n.get("summary", ""),
                        attributes=json.loads(n.get("attributes", "{}")),
                    ))
        except Exception as e:
            logger.warning(f"Fulltext search failed (index may not exist yet): {e}")
            # Fallback: CONTAINS search
            fallback_query = """
            MATCH (n:Entity {graph_id: $graph_id})
            WHERE toLower(n.name) CONTAINS toLower($query)
               OR toLower(n.summary) CONTAINS toLower($query)
            RETURN n
            LIMIT $limit
            """
            with self._driver.session() as session:
                result = session.run(fallback_query, query=query, graph_id=graph_id, limit=limit)
                for record in result:
                    n = record[0]
                    nodes.append(GraphNode(
                        uuid_=n.get("uuid_", ""),
                        name=n.get("name", ""),
                        labels=[l for l in n.labels if l != "Entity"],
                        summary=n.get("summary", ""),
                        attributes=json.loads(n.get("attributes", "{}")),
                    ))

        # Search edges/facts
        edge_query = """
        MATCH (s:Entity {graph_id: $graph_id})-[r]->(t:Entity {graph_id: $graph_id})
        WHERE toLower(r.fact) CONTAINS toLower($query)
           OR toLower(r.name) CONTAINS toLower($query)
        RETURN r, s.uuid_ as source, t.uuid_ as target
        LIMIT $limit
        """
        with self._driver.session() as session:
            result = session.run(edge_query, query=query, graph_id=graph_id, limit=limit)
            for record in result:
                rel = record[0]
                fact = rel.get("fact", "")
                edges.append(GraphEdge(
                    uuid_=rel.get("uuid_", ""),
                    name=rel.get("name", rel.type),
                    fact=fact,
                    source_node_uuid=record["source"],
                    target_node_uuid=record["target"],
                ))
                if fact:
                    facts.append(fact)

        return SearchResult(nodes=nodes, edges=edges, facts=facts)


# ---------------------------------------------------------------------------
# Top-level client (matches Zep() client)
# ---------------------------------------------------------------------------

class Neo4jGraphClient:
    """
    Drop-in replacement for zep_cloud.client.Zep.
    Usage:
        client = Neo4jGraphClient(uri, user, password)
        client.graph.create(graph_id, name)
        client.graph.search(graph_id, query)
        client.graph.node.get(uuid_)
    """

    def __init__(self, uri: str = None, user: str = None, password: str = None):
        uri = uri or os.environ.get("NEO4J_URI", "bolt://localhost:7687")
        user = user or os.environ.get("NEO4J_USER", "neo4j")
        password = password or os.environ.get("NEO4J_PASSWORD", "")

        self._driver = GraphDatabase.driver(uri, auth=(user, password))
        self.graph = GraphOps(self._driver)
        self._init_indexes()

    def _init_indexes(self):
        try:
            with self._driver.session() as session:
                session.run("CREATE INDEX IF NOT EXISTS FOR (n:Entity) ON (n.uuid_)")
                session.run("CREATE INDEX IF NOT EXISTS FOR (n:Entity) ON (n.graph_id)")
                session.run("CREATE INDEX IF NOT EXISTS FOR (n:Entity) ON (n.name)")
                session.run("CREATE INDEX IF NOT EXISTS FOR (e:Episode) ON (e.uuid_)")
                session.run("CREATE INDEX IF NOT EXISTS FOR (e:Episode) ON (e.graph_id)")
                session.run("CREATE INDEX IF NOT EXISTS FOR (g:Graph) ON (g.id)")
                try:
                    session.run(
                        "CREATE FULLTEXT INDEX entity_fulltext IF NOT EXISTS "
                        "FOR (n:Entity) ON EACH [n.name, n.summary]"
                    )
                except Exception:
                    logger.info("Fulltext index already exists or not supported")
            logger.info("Neo4j indexes initialized")
        except Exception as e:
            logger.warning(f"Failed to initialize Neo4j indexes: {e}")

    def close(self):
        self._driver.close()
