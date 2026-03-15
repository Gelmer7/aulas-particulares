import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg text-indigo-900 mb-4">Aulas Particulares</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Mentoria especializada em Química e Física. Preparação focada para vestibulares, 
            ENEM e reforço escolar com metodologia adaptada ao aluno.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 mb-4">Navegação</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-indigo-600">Início</Link></li>
            <li><Link href="/sobre" className="hover:text-indigo-600">Sobre Mim</Link></li>
            <li><Link href="/servicos" className="hover:text-indigo-600">Serviços</Link></li>
            <li><Link href="/agendamento" className="hover:text-indigo-600">Agendar Aula</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 mb-4">Contato</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>WhatsApp: (11) 99999-9999</li>
            <li>Email: contato@exemplo.com</li>
            <li>São Paulo, SP - Aulas Online e Presenciais</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Professora de Exatas. Todos os direitos reservados.</p>
        <div className="mt-2 text-xs">
          <Link href="/login" className="hover:text-indigo-600">Acesso Restrito</Link>
        </div>
      </div>
    </footer>
  );
}
