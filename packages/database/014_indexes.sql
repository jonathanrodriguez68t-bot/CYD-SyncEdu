CREATE INDEX idx_students_institution_status
ON crm.students(institution_id, status);

CREATE INDEX idx_teacher_assignments_lookup
ON academic.teacher_subject_assignments(teacher_id, section_id, subject_id, school_year_id);

CREATE INDEX idx_grades_student_lookup
ON assessment.student_grades(student_id, grade_item_id);

CREATE INDEX idx_activities_course_status_due
ON learning.activities(course_id, status, due_at);

CREATE INDEX idx_notifications_user_created
ON comms.notifications(user_id, created_at DESC);

CREATE INDEX idx_automation_pending
ON automation.events(created_at)
WHERE status = 'pending';