export type TechnicalInterviewForm = {
  role: string;
  experience: string;
  difficulty: string;
  domain: string;
  language: string;
  position: string;
};

export type TechnicalInterviewFormErrors = Record<keyof TechnicalInterviewForm, string>;

export function validateTechnicalInterviewForm(
  form: TechnicalInterviewForm
): TechnicalInterviewFormErrors {
  return {
    role: form.role ? "" : "Please select a role.",
    experience: form.experience ? "" : "Please select experience.",
    difficulty: form.difficulty ? "" : "Please select difficulty.",
    domain: form.domain ? "" : "Please select domain.",
    language: form.language ? "" : "Please select programming language.",
    position: form.position.trim() ? "" : "Position is required.",
  };
}

export function hasTechnicalInterviewFormErrors(
  errors: TechnicalInterviewFormErrors
) {
  return Object.values(errors).some(Boolean);
}
