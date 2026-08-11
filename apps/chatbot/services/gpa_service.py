class GPAService:
    # =========================
    # GRADE CONVERSION
    # =========================
    def letter_to_gpa(self, letter):
        grade_map = {
            "A+": 4.0, "A": 4.0, "A-": 3.666, "B+": 3.333,
            "B": 3.0, "B-": 2.666, "C+": 2.333, "C": 2.0,
            "C-": 1.666, "D+": 1.333, "D": 1.0, "F": 0.0
        }
        return grade_map.get(letter.upper().strip(), None)

    def percentage_to_gpa(self, percentage):
        if percentage >= 90: return 4.0
        elif percentage >= 85: return 3.666
        elif percentage >= 80: return 3.333
        elif percentage >= 75: return 3.0
        elif percentage >= 70: return 2.666
        elif percentage >= 65: return 2.333
        elif percentage >= 60: return 2.0
        elif percentage >= 56: return 1.666
        elif percentage >= 53: return 1.333
        elif percentage >= 50: return 1.0
        else: return 0.0

    def convert_grade_to_point(self, grade):

            if isinstance(grade, str):
                grade = grade.strip()

                # check if it's numeric string
                if grade.replace(".", "", 1).isdigit():
                    grade = float(grade)
                    return self.percentage_to_gpa(grade)

                # otherwise treat as letter
                return self.letter_to_gpa(grade)

            elif isinstance(grade, (int, float)):
                return self.percentage_to_gpa(grade)

            return None

    # =========================
    # GPA CALCULATION
    # =========================
    def calculate_gpa(self, subjects):
        total_points = 0
        total_hours = 0

        for sub in subjects:
            credit = sub["credit_hours"]
            grade_point = self.convert_grade_to_point(sub["grade"])

            if grade_point is not None:
                total_points += credit * grade_point
                total_hours += credit

        return round(total_points / total_hours, 3) if total_hours > 0 else 0

    # =========================
    # PLANNING FUNCTION
    # =========================
    def calculate_balanced_gpa(self, current_gpa, completed_hours, remaining_hours_list, target_gpa):

        grade_scale = [
            ("F", 0.0), ("D", 1.0), ("D+", 1.333), ("C", 2.0), ("C+", 2.333),
            ("B-", 2.666), ("B", 3.0), ("B+", 3.333), ("A-", 3.666), ("A", 4.0)
        ]

        total_remaining_hours = sum(remaining_hours_list)
        total_hours = completed_hours + total_remaining_hours

        needed_points = (target_gpa * total_hours) - (current_gpa * completed_hours)

        if needed_points > (total_remaining_hours * 4.0):
            return {"possible": False}

        required_avg_per_hour = max(0, needed_points / total_remaining_hours)

        target_grade = "A"
        for grade, value in grade_scale:
            if value >= (required_avg_per_hour - 0.001):
                target_grade = grade
                break

        min_grades = [{"hours": h, "grade": target_grade} for h in remaining_hours_list]

        return {
            "possible": True,
            "required_avg_gpa": round(required_avg_per_hour, 3),
            "min_grades": min_grades
        }