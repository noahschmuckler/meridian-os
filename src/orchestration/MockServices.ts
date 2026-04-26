// Mock services for Epic / OneDrive / OpenEvidence / Optum in-basket assistant.
// Phase 0: function shapes only. Each returns canned data shaped like real responses
// so the seam for swapping in real backends later is clean.

export interface MockServices {
  epic: {
    getInbasket(providerId: string): Promise<{ items: { id: string; subject: string; preview: string }[] }>;
    getPatient(mrn: string): Promise<{ mrn: string; name: string; dob: string } | null>;
  };
  openEvidence: {
    submit(query: string): Promise<{ summary: string; citations: { url: string; title: string }[] }>;
  };
  oneDrive: {
    listProject(projectId: string): Promise<{ files: { name: string; path: string }[] }>;
  };
  optumInbasket: {
    suggestReplies(providerId: string): Promise<{ items: { id: string; draft: string }[] }>;
  };
}

export const mockServices: MockServices = {
  epic: {
    getInbasket: async () => ({ items: [] }),
    getPatient: async () => null,
  },
  openEvidence: {
    submit: async () => ({ summary: '', citations: [] }),
  },
  oneDrive: {
    listProject: async () => ({ files: [] }),
  },
  optumInbasket: {
    suggestReplies: async () => ({ items: [] }),
  },
};
