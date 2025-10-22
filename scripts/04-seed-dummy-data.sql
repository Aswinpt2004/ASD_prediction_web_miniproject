-- Insert dummy admin user
INSERT INTO user_profiles (id, email, name, role, phone, organization, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@predictasd.com',
  'Admin User',
  'admin',
  '+1-555-0001',
  'PREDICT-ASD',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert dummy doctor user
INSERT INTO user_profiles (id, email, name, role, phone, organization, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'doctor@predictasd.com',
  'Dr. Sarah Johnson',
  'doctor',
  '+1-555-0002',
  'Children''s Medical Center',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert dummy caretaker user
INSERT INTO user_profiles (id, email, name, role, phone, organization, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'parent@predictasd.com',
  'John Smith',
  'caretaker',
  '+1-555-0003',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert dummy child
INSERT INTO children (id, caretaker_id, name, date_of_birth, gender, medical_history, created_at, updated_at)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000003',
  'Emma Smith',
  '2020-05-15',
  'female',
  'No significant medical history',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert dummy assessment
INSERT INTO assessments (id, child_id, assessment_type, responses, score, risk_level, completed_at, created_at, updated_at)
VALUES (
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'M-CHAT',
  '{"q1": true, "q2": false, "q3": true, "q4": false, "q5": true, "q6": false, "q7": true, "q8": false, "q9": true, "q10": false, "q11": true, "q12": false, "q13": true, "q14": false, "q15": true, "q16": false, "q17": true, "q18": false, "q19": true, "q20": false}',
  8,
  'medium',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert dummy report
INSERT INTO reports (id, child_id, doctor_id, diagnosis, recommendations, follow_up_plan, created_at, updated_at)
VALUES (
  '30000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Preliminary assessment suggests possible autism spectrum characteristics. Further evaluation recommended.',
  'Continue monitoring developmental milestones. Consider speech and occupational therapy evaluation.',
  'Follow-up appointment in 3 months. Recommend comprehensive developmental assessment.',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
