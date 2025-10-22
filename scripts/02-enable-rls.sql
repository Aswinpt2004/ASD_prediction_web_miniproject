-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- children policies
CREATE POLICY "Caretakers can view their own children" ON children
  FOR SELECT USING (caretaker_id = auth.uid());

CREATE POLICY "Caretakers can insert their own children" ON children
  FOR INSERT WITH CHECK (caretaker_id = auth.uid());

CREATE POLICY "Caretakers can update their own children" ON children
  FOR UPDATE USING (caretaker_id = auth.uid());

CREATE POLICY "Doctors can view children they have reports for" ON children
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reports WHERE reports.child_id = children.id AND reports.doctor_id = auth.uid()
    )
  );

-- assessments policies
CREATE POLICY "Users can view assessments for their children" ON assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = assessments.child_id AND children.caretaker_id = auth.uid()
    )
  );

CREATE POLICY "Caretakers can insert assessments for their children" ON assessments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = child_id AND children.caretaker_id = auth.uid()
    )
  );

-- uploads policies
CREATE POLICY "Users can view uploads for their children" ON uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = uploads.child_id AND children.caretaker_id = auth.uid()
    )
    OR uploaded_by = auth.uid()
  );

CREATE POLICY "Users can upload media for their children" ON uploads
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM children WHERE children.id = child_id AND children.caretaker_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own uploads" ON uploads
  FOR DELETE USING (uploaded_by = auth.uid());

-- reports policies
CREATE POLICY "Doctors can view their own reports" ON reports
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Caretakers can view reports for their children" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = reports.child_id AND children.caretaker_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can insert reports" ON reports
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update their own reports" ON reports
  FOR UPDATE USING (doctor_id = auth.uid());

-- chat_messages policies
CREATE POLICY "Users can view their own messages" ON chat_messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" ON chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());
