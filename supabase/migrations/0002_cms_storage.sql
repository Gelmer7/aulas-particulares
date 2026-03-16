-- Criar Bucket para o CMS (Imagens e Mídias Públicas)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public-site-media', 'public-site-media', true)
ON CONFLICT (id) DO NOTHING;

-- Policies de Segurança para o Bucket 'public-site-media'

-- 1. Leitura: Qualquer pessoa pode ler imagens do site público
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'public-site-media');

-- 2. Inserção: Apenas Usuários Logados como "admin" podem fazer upload
CREATE POLICY "Admin Insert Access" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'public-site-media' 
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Atualização: Apenas Admins podem atualizar
CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'public-site-media'
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Deleção: Apenas Admins podem deletar
CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'public-site-media'
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
