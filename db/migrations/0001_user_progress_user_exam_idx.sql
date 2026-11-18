-- Supports user-scoped attempt lookups for subject completion aggregation.
CREATE INDEX IF NOT EXISTS user_progress_user_exam_idx
  ON user_progress (user_id, exam_id);
