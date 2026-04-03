"""
MiroFish Zep-to-Neo4j Patch

Run this script to monkey-patch MiroFish's backend to use Neo4j instead of Zep Cloud.
It replaces the `zep_cloud` module at the Python level so existing imports work unchanged.

Usage:
    # In MiroFish's run.py or app/__init__.py, add before any other imports:
    import neo4j_adapter.patch_mirofish

    # Or set the env var:
    USE_NEO4J=true

That's it. All `from zep_cloud.client import Zep` calls will use the Neo4j shim.
"""

import sys
import os
import types
import logging
from dataclasses import dataclass

logger = logging.getLogger("mirofish.patch")


def apply_patch():
    """Replace zep_cloud module with Neo4j shim."""
    from .zep_shim import ZepNeo4jShim

    # Create fake zep_cloud module hierarchy
    zep_cloud = types.ModuleType("zep_cloud")
    zep_cloud_client = types.ModuleType("zep_cloud.client")

    # The main client class — Zep() now returns our shim
    zep_cloud_client.Zep = ZepNeo4jShim
    zep_cloud.client = zep_cloud_client

    # Mock data classes that MiroFish imports
    @dataclass
    class EpisodeData:
        data: str = ""
        text: str = ""
        source: str = "text"
        source_description: str = ""

        def __init__(self, data: str = "", text: str = "", **kwargs):
            self.data = data or text
            self.text = text or data
            for k, v in kwargs.items():
                setattr(self, k, v)

    @dataclass
    class EntityEdgeSourceTarget:
        source: str = ""
        target: str = ""

    zep_cloud.EpisodeData = EpisodeData
    zep_cloud.EntityEdgeSourceTarget = EntityEdgeSourceTarget

    # Mock the InternalServerError that zep_paging.py imports
    class InternalServerError(Exception):
        pass

    zep_cloud.InternalServerError = InternalServerError

    # Mock external_clients.ontology for graph_builder.py dynamic import
    zep_cloud_ontology = types.ModuleType("zep_cloud.external_clients.ontology")

    @dataclass
    class EntityModel:
        name: str = ""
        description: str = ""

    @dataclass
    class EntityText:
        text: str = ""

    @dataclass
    class EdgeModel:
        name: str = ""
        description: str = ""
        source_entity: str = ""
        target_entity: str = ""

    zep_cloud_ontology.EntityModel = EntityModel
    zep_cloud_ontology.EntityText = EntityText
    zep_cloud_ontology.EdgeModel = EdgeModel

    zep_cloud_external = types.ModuleType("zep_cloud.external_clients")
    zep_cloud_external.ontology = zep_cloud_ontology

    zep_cloud.external_clients = zep_cloud_external

    # Register all fake modules
    sys.modules["zep_cloud"] = zep_cloud
    sys.modules["zep_cloud.client"] = zep_cloud_client
    sys.modules["zep_cloud.external_clients"] = zep_cloud_external
    sys.modules["zep_cloud.external_clients.ontology"] = zep_cloud_ontology

    logger.info("Zep Cloud patched → Neo4j adapter active")


# Auto-apply if USE_NEO4J is set
if os.environ.get("USE_NEO4J", "true").lower() == "true":
    apply_patch()
