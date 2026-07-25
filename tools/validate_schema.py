#!/usr/bin/env python3
"""Execute the MindSage migrations in an isolated SQLite database."""

from __future__ import annotations

import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MIGRATIONS = ROOT / "apps" / "api" / "src" / "main" / "resources" / "db" / "migration"


def main() -> None:
    scripts = sorted(MIGRATIONS.glob("V*.sql"))
    if not scripts:
        raise SystemExit(f"No migrations found in {MIGRATIONS}")

    with sqlite3.connect(":memory:") as database:
        database.execute("PRAGMA foreign_keys = ON")
        for script in scripts:
            database.executescript(script.read_text(encoding="utf-8"))

        table_count = database.execute(
            """
            SELECT COUNT(*)
            FROM sqlite_master
            WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
            """
        ).fetchone()[0]
        foreign_key_errors = database.execute("PRAGMA foreign_key_check").fetchall()
        people = database.execute("SELECT COUNT(*) FROM people").fetchone()[0]
        events = database.execute("SELECT COUNT(*) FROM life_events").fetchone()[0]
        wisdom = database.execute("SELECT COUNT(*) FROM wisdom_entries").fetchone()[0]

    expected = {"tables": 81, "people": 3, "events": 7, "wisdom": 4}
    actual = {
        "tables": table_count,
        "people": people,
        "events": events,
        "wisdom": wisdom,
    }

    if actual != expected:
        raise SystemExit(f"Unexpected schema contents: expected {expected}, got {actual}")
    if foreign_key_errors:
        raise SystemExit(f"Foreign-key errors: {foreign_key_errors}")

    print(
        "MindSage schema valid: "
        f"{table_count} tables, {people} people, {events} events, {wisdom} wisdom entries."
    )


if __name__ == "__main__":
    main()

