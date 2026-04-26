# Database Schema (Initial Draft)

## `child_profile`
Stores user personalization data and preferences.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to Auth)
- `name` (String)
- `age` (Integer)
- `interests` (Array of Strings) - e.g., ["space", "dinosaurs"]
- `deprioritized_themes` (JSON) - e.g., `{"trucks": "2026-04-24T00:00:00Z"}`
- `created_at` (Timestamp)

## `library_content`
Stores sanitized, public-domain stories fetched via Gutendex.
- `id` (UUID, Primary Key)
- `title` (String)
- `author` (String)
- `cleaned_text` (Text) - Text sanitized and tagged for TTS.
- `summary` (Text) - 2-sentence blurb.
- `themes` (Array of Strings) - e.g., ["Bravery", "Animals"]
- `created_at` (Timestamp)

## `saga_memories`
Stores continuity nodes for "Saga Mode".
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key to `child_profile`)
- `world_name` (String)
- `recent_events` (Text)
- `established_characters` (JSON)
- `last_session_date` (Timestamp)
