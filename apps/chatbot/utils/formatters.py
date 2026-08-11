def format_course_results(results, COURSES_CATALOG):
    if not results:
        return "للأسف مش لاقي بيانات للمواد دي حالياً."

    formatted = []
    for r in results:
        course = r.get("course", "Unknown")
        course_code = COURSES_CATALOG.get(course, {}).get("code", "")
        eligible = r.get("eligible", False)

        if eligible:
            status = "✅ متاح لك تسجلها"
            if r.get("gpa") is not None:
                status += f" (معدل أدائك في متطلباتها: {r['gpa']:.2f})"
        else:
            reasons = []
            if r.get("missing"):
                reasons.append("مش واخد: " + " و ".join(r["missing"]))
            if r.get("failed"):
                reasons.append("راسب في: " + " و ".join(r["failed"]))
            if r.get("incomplete"):
                reasons.append("غير مكتمل: " + " و ".join(r["incomplete"]))

            if not reasons:
                reasons.append(r.get("reason", "لم يتم استيفاء الشروط"))

            status = "❌ غير متاح\n   " + " | ".join(reasons)

        formatted.append(f"📍 **{course}** [{course_code}]\n   {status}")

    return "\n".join(formatted)