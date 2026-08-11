
// ─── Helpers ─────────────────────────────────────────────────────────────────

const fullName = (p) =>
  [p.first_name, p.second_name, p.third_name, p.fourth_name]
    .filter(Boolean)
    .join(' ');

const shortName = (p) =>
  [p.first_name, p.second_name].filter(Boolean).join(' ');

const formatDate = (iso) => (iso ? iso.slice(0, 10) : '');

// studyInfo.level is 1–4; forms display the Arabic ordinal string.
const levelToArabic = (level) =>
  ({ 1: 'الأولى', 2: 'الثانية', 3: 'الثالثة', 4: 'الرابعة' })[Number(level)] ?? String(level);

// ─── Field map ────────────────────────────────────────────────────────────────
// Keys = exact `name` values from form_schema in the DB.

const FIELD_MAP = {

  // ── Full / short name ─────────────────────────────────────────────────
  // Used by: MIL_EDU, ENR_SUSP, SPC_PRG, PUB_PRG, CRS_REG, TUIT_INST,
  //          CRS_WTH, MED_EXAM, GRD_APL, GRAD_CERT
  student_name_quad: {
    extract: ({ profile: p }) => fullName(p),
    readOnly: true,
  },
  student_name: {
    extract: ({ profile: p }) => shortName(p),
    readOnly: true,
  },
  name_en: {                              // SPC_PRG, PUB_PRG
    extract: ({ profile: p }) => fullName(p),
    readOnly: true,
  },

  // ── Identity ──────────────────────────────────────────────────────────
  // Used by: MIL_EDU, SPC_PRG, PUB_PRG, CRS_WTH, TUIT_INST, MED_EXAM
  national_id: {
    extract: ({ profile: p }) => p.ssn ?? '',
    readOnly: true,
  },

  // ── Student ID / code ─────────────────────────────────────────────────
  // Used by: CRS_REG, TUIT_INST, CRS_WTH, GRD_APL, GRAD_CERT
  student_id: {
    extract: ({ profile: p }) => p.user_id ?? '',
    readOnly: true,
  },
  student_code: {                         // MED_EXAM
    extract: ({ profile: p }) => p.user_id ?? '',
    readOnly: true,
  },

  // ── Contact ───────────────────────────────────────────────────────────
  mobile_phone: {                         // MIL_EDU, SPC_PRG, PUB_PRG
    extract: ({ profile: p }) => p.phone ?? '',
    readOnly: false,
  },
  mobile: {                               // CRS_WTH
    extract: ({ profile: p }) => p.phone ?? '',
    readOnly: false,
  },
  student_phone: {                        // ENR_SUSP
    extract: ({ profile: p }) => p.phone ?? '',
    readOnly: false,
  },
  phone: {                                // CRS_REG, TUIT_INST, GRD_APL
    extract: ({ profile: p }) => p.phone ?? '',
    readOnly: false,
  },
  email: {                                // SPC_PRG, PUB_PRG, CRS_WTH, GRD_APL
    extract: ({ profile: p }) => p.email ?? '',
    readOnly: true,
  },
  university_email: {                     // CRS_REG
    extract: ({ profile: p }) => p.email ?? '',
    readOnly: true,
  },

  // ── Academic – from profile ───────────────────────────────────────────
  program: {                              // ENR_SUSP, CRS_REG, TUIT_INST, CRS_WTH, GRD_APL, GRAD_CERT
    extract: ({ profile: p }) => p.student?.program?.program_name_en ?? '',
    readOnly: true,
  },
  department: {                           // MIL_EDU
    extract: ({ profile: p }) => p.student?.program?.program_name_en ?? '',
    readOnly: true,
  },
  academic_year: {                        // ENR_SUSP, SPC_PRG, PUB_PRG, TUIT_INST
    extract: ({ profile: p }) => p.student?.academic_semester?.academic_year ?? '',
    readOnly: true,
  },
  university: {                           // MIL_EDU
    extract: () => 'Alexandria University',
    readOnly: true,
  },
  faculty: {                              // MIL_EDU, ENR_SUSP
    extract: () => 'كلية الحاسبات وعلوم البيانات',
    readOnly: true,
  },

  // ── Academic level – from study-info ──────────────────────────────────
  // DB uses two field names for "level":
  //   • year_group → MIL_EDU       (label: "الفرقة")
  //   • level      → ENR_SUSP, CRS_REG, TUIT_INST, CRS_WTH, GRD_APL
  //                  (labels: "الفرقة / المستوى الدراسي", "المستوى الدراسى",
  //                           "المستوى", "المستــــــوي")
  // Both store the Arabic ordinal: "الأولى" … "الرابعة"
  year_group: {
    extract: ({ studyInfo }) => {
      const lvl = studyInfo?.level;
      return lvl != null ? levelToArabic(lvl) : '';
    },
    readOnly: true,
  },
  level: {
    extract: ({ studyInfo }) => {
      const lvl = studyInfo?.level;
      return lvl != null ? levelToArabic(lvl) : '';
    },
    readOnly: true,
  },

  // ── Academic stats – from study-info ──────────────────────────────────
  // completed_hours → CRS_REG  (label: "عدد الساعات التي اجتازها الطالب…")
  completed_hours: {
    extract: ({ studyInfo }) =>
      studyInfo?.completedHours != null ? String(studyInfo.completedHours) : '',
    readOnly: true,
  },
  // cgpa → CRS_WTH  (label: "CGPA")
  cgpa: {
    extract: ({ studyInfo }) =>
      studyInfo?.cgpa != null ? String(studyInfo.cgpa) : '',
    readOnly: true,
  },

  // ── Personal ──────────────────────────────────────────────────────────
  birth_date: {                           // SPC_PRG, PUB_PRG, MED_EXAM
    extract: ({ profile: p }) => formatDate(p.birth),
    readOnly: true,
  },
  address: {                              // SPC_PRG, PUB_PRG, MED_EXAM
    extract: () => '',
    readOnly: false,
  },
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * @param {Array}  fields    — form_schema.fields array
 * @param {object} profile   — response from GET /users/profile → data
 * @param {object} studyInfo — response from GET /students/study-info → data
 * @returns {{ values: object, readOnly: Set<string> }}
 */
export const buildPrefillState = (fields = [], profile = null, studyInfo = null) => {
  const values = {};
  const readOnly = new Set();
  const sources = { profile: profile ?? {}, studyInfo: studyInfo ?? {} };

  fields.forEach((field) => {
    const mapping = FIELD_MAP[field.name];

    if (mapping && (profile || studyInfo)) {
      const extracted = mapping.extract(sources);

      if (extracted !== '' && extracted !== null && extracted !== undefined) {
        values[field.name] = extracted;
        if (mapping.readOnly) readOnly.add(field.name);
      } else {
        values[field.name] = field.type === 'checkbox' ? false
          : field.type === 'checkbox_group' ? []
          : '';
      }
    } else {
      values[field.name] = field.type === 'checkbox' ? false
        : field.type === 'checkbox_group' ? []
        : '';
    }
  });

  return { values, readOnly };
};