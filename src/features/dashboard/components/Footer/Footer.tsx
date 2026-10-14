export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full space-y-1 border-t border-slate-200/80 bg-white px-6 py-6 text-center text-xs text-slate-500 shadow-inner">
      <p className="font-bold text-slate-700">
        IMPERIAL PIZZA <span aria-hidden="true">•</span> SISTEMA DE OPERAÇÕES V4.0
      </p>

      <p>
        © {currentYear} Imperial Pizza. Todos os direitos reservados.
      </p>
    </footer>
  );
}