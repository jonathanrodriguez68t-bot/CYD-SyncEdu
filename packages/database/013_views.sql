CREATE VIEW portal.v_student_current_summary AS
SELECT
    s.id AS student_id,
    s.institution_id,
    s.student_code,
    s.first_name,
    s.last_name,
    sy.name AS school_year,
    gl.name AS grade_level,
    sec.name AS section_name,
    e.status AS enrollment_status
FROM crm.students s
JOIN academic.enrollments e ON e.student_id = s.id
JOIN academic.school_years sy ON sy.id = e.school_year_id
JOIN academic.sections sec ON sec.id = e.section_id
JOIN academic.grade_levels gl ON gl.id = sec.grade_level_id
WHERE e.status = 'active';

CREATE VIEW portal.v_student_grades AS
SELECT
    sg.student_id,
    gi.id AS grade_item_id,
    gi.title AS grade_title,
    sub.name AS subject_name,
    sg.score,
    gi.max_score,
    sg.status,
    sg.feedback,
    gi.published_at
FROM assessment.student_grades sg
JOIN assessment.grade_items gi ON gi.id = sg.grade_item_id
JOIN learning.courses c ON c.id = gi.course_id
JOIN academic.teacher_subject_assignments tsa ON tsa.id = c.teacher_assignment_id
JOIN academic.subjects sub ON sub.id = tsa.subject_id
WHERE gi.status = 'published';