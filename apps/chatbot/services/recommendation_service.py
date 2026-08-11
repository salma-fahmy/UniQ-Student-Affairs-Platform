FAILED_GRADES = ["F", "(F)", "ABS", "FW", "U"]
INCOMPLETE_GRADES = ["I"]

class RecommendationService:

    def __init__(self, gpa_service, matcher=None):
        self.gpa_service = gpa_service
        self.matcher = matcher
        
        self.REQUIREMENTS_CEILINGS = {
            "university_elective": 3,   
            "faculty_elective": 4,      
            "program_elective": 4,      
        }

    def is_failed(self, grade):
        if grade is None:
            return True
        return str(grade).strip().upper() in FAILED_GRADES

    def is_incomplete(self, grade):
        if grade is None:
            return False
        return str(grade).strip().upper() in INCOMPLETE_GRADES

    def _get_student_completed_courses_by_type(self, student_records, courses_catalog, catalog_map):
    
        completed_by_type = {}
        for course_name, record in student_records.items():
            grade = record.get("grade")
            if grade and not self.is_failed(grade) and not self.is_incomplete(grade):
                course_key = course_name.strip().lower()
                real_course_name = catalog_map.get(course_key, course_name)
                
                catalog_info = courses_catalog.get(real_course_name, {})
                c_type = catalog_info.get("course_type", "faculty_obligatory")
                
                if c_type not in completed_by_type:
                    completed_by_type[c_type] = []
                completed_by_type[c_type].append(real_course_name)
        return completed_by_type

    def recommend_course(self, courses, student_records, courses_catalog, student_dept=""):
    
        results = []
        
        normalized_records = {
            k.strip().lower(): v
            for k, v in student_records.items() if k
        }

        catalog_map = {
            k.strip().lower(): k
            for k in courses_catalog.keys()
        }

        completed_by_type = self._get_student_completed_courses_by_type(student_records, courses_catalog, catalog_map)

        student_dept_clean = str(student_dept).strip().upper()

        for course in courses:
            if not course:
                continue
                
            course_key = course.strip().lower()
            real_course_name = catalog_map.get(course_key, course)
            course_info = courses_catalog.get(real_course_name, {})
            
            course_type = course_info.get("course_type", "faculty_obligatory")
            course_dept = str(course_info.get("department", "")).strip().upper()

            course_record = normalized_records.get(course_key)
            already_completed = False

            if course_record:
                grade = course_record.get("grade")
                if grade and not self.is_failed(grade) and not self.is_incomplete(grade):
                    already_completed = True

            if already_completed:
                results.append({
                    "course": real_course_name,
                    "eligible": False,  
                    "auto_recommended": False,
                    "already_completed": True,
                    "course_type": course_type,
                    "dept_lock": False,
                    "missing": [], "failed": [], "incomplete": [],
                    "reason": "مادة مكتملة ومجتازة سابقاً بنجاح ✅",
                    "gpa": None, "prereq_count": 0, "no_prereqs": False, "completed_prereqs": []
                })
                continue  

            if "program" in str(course_type).lower() and course_dept:
                if course_dept != student_dept_clean:
                    results.append({
                        "course": real_course_name,
                        "eligible": False,
                        "auto_recommended": False,
                        "already_completed": False,
                        "course_type": course_type,
                        "dept_lock": True,
                        "course_dept": course_info.get("department", course_dept),
                        "missing": [], "failed": [], "incomplete": [],
                        "reason": f"المادة تابعة لقسم {course_dept} والطالب في قسم {student_dept_clean}",
                        "gpa": None, "prereq_count": 0, "completed_prereqs": []
                    })
                    continue

            is_extra_course = False
            if course_type in self.REQUIREMENTS_CEILINGS:
                completed_count = len(completed_by_type.get(course_type, []))
                if completed_count >= self.REQUIREMENTS_CEILINGS[course_type]:
                    is_extra_course = True

            prereqs = course_info.get("prereq", []) or []
            missing, failed, incomplete, subjects_for_gpa = [], [], [], []

            for p in prereqs:
                if not p: 
                    continue
                p_clean = str(p).strip().lower()

                if p_clean not in normalized_records:
                    missing.append(p)
                else:
                    record = normalized_records.get(p_clean, {})
                    grade = record.get("grade")

                    if self.is_failed(grade):
                        failed.append(p)
                    elif self.is_incomplete(grade):
                        incomplete.append(p)
                    else:
                        credit = record.get("credit_hours", 0)
                        subjects_for_gpa.append({
                            "name": p, "credit_hours": credit, "grade": grade
                        })

            is_eligible = len(missing) == 0 and len(failed) == 0 and len(incomplete) == 0

            gpa = None
            if is_eligible and subjects_for_gpa:
                gpa = self.gpa_service.calculate_gpa(subjects_for_gpa)

            item = {
                "course": real_course_name,
                "eligible": is_eligible,
                "auto_recommended": is_eligible and len(prereqs) == 0,
                "already_completed": False,
                "course_type": course_type,
                "dept_lock": False,
                "is_extra_course": is_extra_course,
                "missing": missing, "failed": failed, "incomplete": incomplete,
                "gpa": gpa,
                "prereq_count": len(prereqs),
                "completed_prereqs": [p for p in prereqs if p and str(p).strip().lower() in normalized_records]
            }
            results.append(item)

        grouped_results = {}
        for r in results:
            c_type = r["course_type"]
            if c_type not in grouped_results:
                grouped_results[c_type] = {
                    "requested_courses": [],
                    "completed_before": completed_by_type.get(c_type, []),
                    "ceiling_max": self.REQUIREMENTS_CEILINGS.get(c_type, None)
                }
            grouped_results[c_type]["requested_courses"].append(r)

        for c_type, group in grouped_results.items():
            eligible_in_group = [
                c for c in group["requested_courses"] 
                if c["eligible"] and not c.get("already_completed", False)
            ]
            
            group["ranked_eligible"] = sorted(
                eligible_in_group,
                key=lambda x: (
                    1 if x.get("auto_recommended") else 0,            
                    x["gpa"] if x["gpa"] is not None else -1.0,         
                    -x["prereq_count"]                                
                ),
                reverse=True
            )

        eligible_courses = [
            r for r in results 
            if r["eligible"] and not r.get("already_completed", False)
        ]
        
        ranked_courses = sorted(
            eligible_courses,
            key=lambda x: (
                1 if "obligatory" in str(x["course_type"]).lower() else 0,
                -1 if x.get("is_extra_course") else 0,                    
                1 if x.get("auto_recommended") else 0,                     
                x["gpa"] if x["gpa"] is not None else -1.0,                 
                -x["prereq_count"]                                        
            ),
            reverse=True
        )

        return results, ranked_courses, grouped_results