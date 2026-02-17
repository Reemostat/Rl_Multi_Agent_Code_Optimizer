"""
Save optimization history to Supabase.
"""

import os
import asyncio
from typing import Dict, Any
from supabase import Client
from concurrent.futures import ThreadPoolExecutor
import structlog
import json

from backend.auth import get_supabase_client

logger = structlog.get_logger()

# Thread pool for running sync Supabase calls
_executor = ThreadPoolExecutor(max_workers=5)

async def save_optimization_history(user_id: str, result: Dict[str, Any]) -> None:
    """
    Save optimization result to history table.
    """
    supabase = get_supabase_client()
    if not supabase:
        logger.warning("Supabase client not available, skipping history save")
        return
    
    try:
        # Extract metrics
        metrics = result.get("metrics", {})
        trace = result.get("trace", [])
        objective_weights = result.get("objective_weights", {})
        
        # Get refinement depth from result (preferred) or calculate from trace
        refinement_depth = result.get("refinement_depth")
        if refinement_depth is None:
            refinement_depth = len(trace) if trace else 0
        
        # Prepare history record - only include fields that exist in schema
        history_record = {
            "user_id": user_id,
            "original_code": "",  # Don't store full code for privacy/space
            "optimized_code": "",  # Don't store full code
            "reward": result.get("reward", 0.0),
            "quality_score": metrics.get("quality_score"),
            "refinement_depth": refinement_depth,
            "strategy_used": result.get("strategy", "unknown"),
            "objective_weights": json.dumps(objective_weights),
            "trace": json.dumps(trace),
        }
        
        # Add improvement percentages if they exist in metrics (optional fields)
        if "runtime_improvement_pct" in metrics:
            history_record["runtime_improvement_pct"] = metrics.get("runtime_improvement_pct", 0.0)
        if "memory_improvement_pct" in metrics:
            history_record["memory_improvement_pct"] = metrics.get("memory_improvement_pct", 0.0)
        
        # Add delta fields if they exist in schema (for backwards compatibility)
        # Calculate deltas
        runtime_delta = metrics.get("optimized_runtime", 0) - metrics.get("baseline_runtime", 0)
        memory_delta = metrics.get("optimized_memory", 0) - metrics.get("baseline_memory", 0)
        
        # Try to insert with all fields first, fallback without optional fields if schema doesn't support
        history_record_with_all = {
            **history_record,
            "runtime_delta": runtime_delta,
            "memory_delta": memory_delta,
        }
        
        # Run in thread pool
        loop = asyncio.get_event_loop()
        try:
            await loop.run_in_executor(
                _executor,
                lambda: supabase.table("optimization_history").insert(history_record_with_all).execute()
            )
        except Exception as insert_error:
            error_str = str(insert_error)
            # If specific columns don't exist, try without them
            if "memory_delta" in error_str or "runtime_delta" in error_str:
                logger.warning("Schema missing delta columns, inserting without them")
                try:
                    await loop.run_in_executor(
                        _executor,
                        lambda: supabase.table("optimization_history").insert(history_record).execute()
                    )
                except Exception as second_error:
                    error_str_2 = str(second_error).lower()
                    # If improvement_pct or refinement_depth columns don't exist, remove them
                    if "improvement_pct" in error_str_2 or "refinement_depth" in error_str_2:
                        logger.warning("Schema missing improvement_pct/refinement_depth columns, inserting minimal record")
                        minimal_record = {
                            "user_id": user_id,
                            "reward": result.get("reward", 0.0),
                            "strategy_used": result.get("strategy", "unknown"),
                        }
                        # Only add fields that don't cause errors - explicitly exclude problematic fields
                        # Don't add refinement_depth if it's mentioned in the error
                        if "refinement_depth" not in error_str_2:
                                minimal_record["refinement_depth"] = refinement_depth
                        
                        # Don't add quality_score if it's mentioned in the error
                        if "quality_score" not in error_str_2 and metrics.get("quality_score") is not None:
                                minimal_record["quality_score"] = metrics.get("quality_score")
                        
                        # Don't add improvement_pct fields if they're mentioned in the error
                        if "runtime_improvement_pct" not in error_str_2 and "runtime_improvement_pct" in metrics:
                            minimal_record["runtime_improvement_pct"] = metrics.get("runtime_improvement_pct", 0.0)
                        if "memory_improvement_pct" not in error_str_2 and "memory_improvement_pct" in metrics:
                            minimal_record["memory_improvement_pct"] = metrics.get("memory_improvement_pct", 0.0)
                        
                        # Try to add objective_weights and trace if they don't cause errors
                        try:
                            if "objective_weights" not in error_str_2:
                                minimal_record["objective_weights"] = json.dumps(objective_weights)
                            if "trace" not in error_str_2:
                                minimal_record["trace"] = json.dumps(trace)
                        except:
                            pass  # Skip if they cause issues
                        
                        try:
                            await loop.run_in_executor(
                                _executor,
                                lambda: supabase.table("optimization_history").insert(minimal_record).execute()
                            )
                            logger.info("Successfully saved minimal optimization history record")
                        except Exception as final_error:
                            # Last resort: save only the absolute minimum required fields
                            final_minimal = {
                                "user_id": user_id,
                                "reward": result.get("reward", 0.0),
                                "strategy_used": result.get("strategy", "unknown"),
                            }
                            try:
                                await loop.run_in_executor(
                                    _executor,
                                    lambda: supabase.table("optimization_history").insert(final_minimal).execute()
                                )
                                logger.info("Successfully saved absolute minimal optimization history record")
                            except Exception as ultimate_error:
                                logger.warning(f"All insert attempts failed. Last error: {ultimate_error}, skipping history save")
                    else:
                        raise
            elif "improvement_pct" in error_str:
                logger.warning("Schema missing improvement_pct columns, inserting without them")
                minimal_record = {k: v for k, v in history_record.items() if "improvement_pct" not in k}
                minimal_record["runtime_delta"] = runtime_delta
                minimal_record["memory_delta"] = memory_delta
                await loop.run_in_executor(
                    _executor,
                    lambda: supabase.table("optimization_history").insert(minimal_record).execute()
                )
            else:
                raise
        
        logger.info("optimization_history_saved", user_id=user_id, reward=result.get("reward"))
    
    except Exception as e:
        logger.error(f"Failed to save optimization history: {e}")

