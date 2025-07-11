import React from 'react';

interface FullTimeFormState {
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
  sales_experience: string;
  coverletter: string | File | null;
  education_fulltime: string;
  answers_fulltime: string[];
}

interface FullTimeApplicationFormProps {
  form: FullTimeFormState;
  setForm: React.Dispatch<React.SetStateAction<FullTimeFormState>>;
  handleInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setStep: React.Dispatch<React.SetStateAction<'role' | 'job' | 'desc' | 'self' | 'recommend' | 'fulltimejob'>>;
  questions: string[];
  loading?: boolean;
}

const FullTimeApplicationForm: React.FC<FullTimeApplicationFormProps> = ({ form, setForm, handleInput, handleSubmit, setStep, questions, loading }) => (
  <form className="bg-[#232323] p-6 rounded-2xl w-full max-w-2xl min-w-[320px] text-white flex flex-col gap-6 mx-auto" onSubmit={handleSubmit}>
    <h3 className="text-3xl font-bold mb-2">Apply for the Job</h3>
    <label className="flex flex-col gap-2">
      Full Name*
      <input name="name" value={typeof form.name === 'string' ? form.name : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" required />
    </label>
    <label className="flex flex-col gap-2">
      Email Address*
      <input name="email" type="email" value={typeof form.email === 'string' ? form.email : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" required />
    </label>
    <label className="flex flex-col gap-2">
      Phone Number*
      <input name="phone" value={typeof form.phone === 'string' ? form.phone : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" required />
    </label>
    <label className="flex flex-col gap-2">
      LinkedIn Profile Link
      <input name="linkedin" value={typeof form.linkedin === 'string' ? form.linkedin : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" />
    </label>
    <label className="flex flex-col gap-2">
      Educational Background*
      <select name="education_fulltime" value={typeof form.education_fulltime === 'string' ? form.education_fulltime : ''} onChange={handleInput} className="p-2 rounded text-black border-2 border-white bg-white" required>
        <option value="">Select...</option>
        <option value="Undergraduate Degree">Undergraduate Degree</option>
        <option value="Graduate Degree">Graduate Degree</option>
        <option value="Other">Other</option>
      </select>
    </label>
    <label className="flex flex-col gap-2 font-bold">
      CV Link*
      <input
        name="cv"
        type="url"
        placeholder="https://drive.google.com/your-cv-link"
        value={typeof form.cv === 'string' ? form.cv : ''}
        onChange={handleInput}
        className="p-2 rounded text-black bg-white font-normal"
        required
      />
    </label>
    <label className="flex flex-col gap-2 font-bold">
      Cover Letter Link
      <input
        name="coverletter"
        type="url"
        placeholder="https://drive.google.com/your-cover-letter-link"
        value={typeof form.coverletter === 'string' ? form.coverletter : ''}
        onChange={handleInput}
        className="p-2 rounded text-black bg-white font-normal"
      />
    </label>
    <div className="mt-4">
      <h4 className="text-2xl font-bold mb-2">Strategic Thinking & Experience</h4>
      {questions.map((q, i) => (
        <label key={i} className="flex flex-col gap-2 mt-4">
          <span>{i + 1}. {q}</span>
          <textarea name={`answer_fulltime_${i}`} value={form.answers_fulltime[i]} onChange={e => setForm((f: FullTimeFormState) => ({ ...f, answers_fulltime: f.answers_fulltime.map((a: string, idx: number) => idx === i ? e.target.value : a) }))} className="p-2 rounded text-black border-2 border-white bg-white focus:border-white outline-none" rows={3} required />
        </label>
      ))}
    </div>
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

export default FullTimeApplicationForm; 