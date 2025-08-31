import { supabase } from '@/logic/auth/supabaseAuth'
import { encryptJSON, decryptJSON, type EncryptedBundle } from '@/logic/crypto/e2ee'

export type SecureProfile = {
  email: string
  createdAt: string
  deviceId: string
}

export async function saveEncryptedProfile(userId: string, passphrase: string, data: SecureProfile) {
  const bundle = await encryptJSON(data, passphrase)
  const { error } = await supabase!
    .from('profiles_secure')
    .upsert({
      user_id: userId,
      version: bundle.version,
      salt: bundle.salt,
      iv: bundle.iv,
      ciphertext: bundle.ciphertext,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
  if (error) throw error
}

export async function loadEncryptedProfile(userId: string, passphrase: string): Promise<SecureProfile | null> {
  const { data, error } = await supabase!
    .from('profiles_secure')
    .select('version,salt,iv,ciphertext')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const bundle = data as EncryptedBundle
  return await decryptJSON(bundle, passphrase)
}





