import { supabase } from '../lib/supabaseClient';

export async function uploadFile(file: File, folder: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('applicatns') // Use the actual bucket name that exists
    .upload(fileName, file);

  if (error) {
    console.error('Upload error details:', JSON.stringify(error, null, 2));
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('applicatns') // Use the actual bucket name that exists
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
} 