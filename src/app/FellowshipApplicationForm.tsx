import React from 'react';

export interface FellowshipFormState {
  name: string;
  email: string;
  phone: string;
  cv: string | File | null;
  answers: string[];
  linkedin: string;
  education: string;
  major: string;
  experience: string;
  interest: string;
  portfolio: string;
  other: string;
  figma_experience?: string;
  cloud_experience?: string;
  linux_experience?: string;
  network_experience?: string;
  appstore_experience?: string;
  sales_experience: string;
  coverletter: string | File | null;
  education_fulltime: string;
  answers_fulltime: string[];
}

interface FellowshipApplicationFormProps {
  form: FellowshipFormState;
  setForm: React.Dispatch<React.SetStateAction<FellowshipFormState>>;
  handleInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setStep: React.Dispatch<React.SetStateAction<'role' | 'job' | 'desc' | 'self' | 'recommend' | 'fulltimejob'>>;
  role: 'data' | 'marketing' | 'sales' | 'frontend' | 'backend' | 'devops' | 'security' | 'mobile';
  loading?: boolean;
}

const roleFields = {
  data: [
    { label: 'Major (Area of Study)*', name: 'major', type: 'text', required: true },
    { label: 'Please describe any prior experience in research and data analysis.*', name: 'experience', type: 'textarea', required: true },
    { label: 'Why are you interested in this role?*', name: 'interest', type: 'textarea', required: true },
  ],
  marketing: [
    { label: 'Major (Area of Study)*', name: 'major', type: 'text', required: true },
    { label: 'Please describe any prior experience in marketing and social media campaigns.*', name: 'experience', type: 'textarea', required: true },
    { label: 'Why are you interested in this role?*', name: 'interest', type: 'textarea', required: true },
    { label: 'Please attach your portfolio below (if you have one).', name: 'portfolio', type: 'file', required: false },
  ],
  sales: [
    { label: 'Major (Area of Study)*', name: 'major', type: 'text', required: true },
    { label: 'Please describe any prior experience with lead generation and market research.*', name: 'experience', type: 'textarea', required: true },
    { label: 'Why are you interested in this role?*', name: 'interest', type: 'textarea', required: true },
  ],
  frontend: [
    { label: 'Major (Area of Study)*', name: 'major', type: 'text', required: true },
    { label: 'Please describe your experience with HTML, CSS, and JavaScript.*', name: 'experience', type: 'textarea', required: true },
    { label: 'What front-end frameworks or libraries have you worked with? (React, Next.js, Vue, etc.)*', name: 'interest', type: 'textarea', required: true },
    { label: 'Please share links to any projects or GitHub repositories you\'d like us to see.', name: 'portfolio', type: 'textarea', required: false },
    { label: 'Have you worked with design tools like Figma? Please describe your experience.', name: 'figma_experience', type: 'textarea', required: false },
  ],
  backend: [
    { label: 'Major (Area of Study)*', name: 'major', type: 'text', required: true },
    { label: 'Please describe your experience with backend programming languages (Node.js, Python, Java, etc.).*', name: 'experience', type: 'textarea', required: true },
    { label: 'What databases and web frameworks have you worked with?*', name: 'interest', type: 'textarea', required: true },
    { label: 'Please share links to any backend projects or APIs you\'ve built.', name: 'portfolio', type: 'textarea', required: false },
    { label: 'Describe any experience you have with cloud platforms (AWS, Google Cloud, Azure).', name: 'cloud_experience', type: 'textarea', required: false },
  ],
  devops: [
    { label: 'Major (Area of Study)*', name: 'major', type: 'text', required: true },
    { label: 'Please describe your experience with cloud platforms and infrastructure tools.*', name: 'experience', type: 'textarea', required: true },
    { label: 'What experience do you have with Docker, CI/CD pipelines, or automation tools?*', name: 'interest', type: 'textarea', required: true },
    { label: 'Please share any relevant projects or certifications you have.', name: 'portfolio', type: 'textarea', required: false },
    { label: 'Describe your experience with Linux/Unix systems and scripting.', name: 'linux_experience', type: 'textarea', required: false },
  ],
  security: [
    { label: 'Major (Area of Study)*', name: 'major', type: 'text', required: true },
    { label: 'Please describe your understanding of cybersecurity principles and concepts.*', name: 'experience', type: 'textarea', required: true },
    { label: 'What security tools or technologies are you familiar with?*', name: 'interest', type: 'textarea', required: true },
    { label: 'Please share any security-related projects, certifications, or research you\'ve done.', name: 'portfolio', type: 'textarea', required: false },
    { label: 'Describe your experience with network security or vulnerability assessment.', name: 'network_experience', type: 'textarea', required: false },
  ],
  mobile: [
    { label: 'Major (Area of Study)*', name: 'major', type: 'text', required: true },
    { label: 'Please describe your experience with mobile development (iOS, Android, React Native, Flutter).*', name: 'experience', type: 'textarea', required: true },
    { label: 'What mobile development frameworks or languages are you most comfortable with?*', name: 'interest', type: 'textarea', required: true },
    { label: 'Please share links to any mobile apps you\'ve developed or contributed to.', name: 'portfolio', type: 'textarea', required: false },
    { label: 'Describe any experience you have with app store deployment or mobile app testing.', name: 'appstore_experience', type: 'textarea', required: false },
  ],
};

const educationOptions = [
  'Undergraduate Student',
  'Recent Graduate (Early Career Professional)',
  'Graduate Student',
  'Other…',
];

const FellowshipApplicationForm: React.FC<FellowshipApplicationFormProps> = ({ form, setForm, handleInput, handleSubmit, setStep, role, loading }) => (
  <form className="bg-[#232323] p-6 rounded-2xl w-full max-w-2xl min-w-[320px] text-white flex flex-col gap-6 mx-auto" onSubmit={handleSubmit}>
    <h3 className="text-3xl font-bold mb-2">Apply for the Fellowship</h3>
    <label className="flex flex-col gap-2">
      Full Name*
      <input name="name" value={typeof form.name === 'string' ? form.name : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" required />
    </label>
    <label className="flex flex-col gap-2">
      Email Address*
      <input name="email" type="email" value={typeof form.email === 'string' ? form.email : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" required />
    </label>
    <label className="flex flex-col gap-2">
      LinkedIn Profile Link
      <input name="linkedin" value={typeof form.linkedin === 'string' ? form.linkedin : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" />
    </label>
    <label className="flex flex-col gap-2">
      Phone Number
      <input name="phone" value={typeof form.phone === 'string' ? form.phone : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" />
    </label>
    <label className="flex flex-col gap-2">
      Educational Background*
      <select name="education" value={typeof form.education === 'string' ? form.education : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" required>
        <option value="">Select...</option>
        {educationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </label>
    {roleFields[role].map((q, idx) => (
      <label key={idx} className="flex flex-col gap-2">
        {q.label}
        {q.type === 'textarea' ? (
          <textarea name={q.name} value={typeof form[q.name as keyof FellowshipFormState] === 'string' ? form[q.name as keyof FellowshipFormState] as string : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" required={q.required} />
        ) : q.type === 'file' ? (
          <input name={q.name} type="file" onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" />
        ) : (
          <input name={q.name} value={typeof form[q.name as keyof FellowshipFormState] === 'string' ? form[q.name as keyof FellowshipFormState] as string : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" required={q.required} />
        )}
      </label>
    ))}
    <label className="flex flex-col gap-2 font-bold">
      Please attach your Resume or CV.*
      <div className="flex items-center gap-2">
        <input
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleInput}
          className="p-2 rounded text-black bg-white font-normal"
          required
        />
        {form.cv && typeof form.cv !== 'string' && (
          <>
            <span className="text-white font-normal text-xs bg-black/40 px-2 py-1 rounded">{form.cv.name}</span>
            <button
              type="button"
              className="text-red-500 font-bold text-lg ml-1"
              onClick={() => setForm((f: FellowshipFormState) => ({ ...f, cv: null }))}
              aria-label="Remove file"
            >
              ×
            </button>
          </>
        )}
      </div>
    </label>
    {/* Only show cover letter for Data role */}
    {role === 'data' && (
      <label className="flex flex-col gap-2 font-bold">
        Please attach your cover letter.
        <div className="flex items-center gap-2">
          <input
            name="coverletter"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleInput}
            className="p-2 rounded text-black bg-white font-normal"
          />
          {form.coverletter instanceof File && (
            <>
              <span className="text-white font-normal text-xs bg-black/40 px-2 py-1 rounded">{form.coverletter.name}</span>
              <button
                type="button"
                className="text-red-500 font-bold text-lg ml-1"
                onClick={() => setForm((f: FellowshipFormState) => ({ ...f, coverletter: null }))}
                aria-label="Remove file"
              >
                ×
              </button>
            </>
          )}
        </div>
      </label>
    )}
    <label className="flex flex-col gap-2">
      Please share anything else about yourself that you&apos;d like us to know!
      <textarea name="other" value={typeof form.other === 'string' ? form.other : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" rows={2} />
    </label>
    <button type="submit" className="bg-[#4FC3F7] hover:bg-[#039BE5] text-white font-bold py-3 px-8 rounded-xl text-xl mt-6" disabled={loading}>
      {loading ? 'Submitting...' : 'Submit Application'}
    </button>
    <button type="button" className="mt-2 underline" onClick={() => setStep('desc')}>Back</button>
  </form>
);

export default FellowshipApplicationForm; 