import { Participante } from '../classes/Participante';

interface ParticipanteCardProps {
  participante: Participante;
  onDelete: (id: number) => void;
}

const nivelStyles: Record<Participante['nivel'], string> = {
  Principiante: 'bg-green-100 border-green-200',
  Intermedio: 'bg-yellow-100 border-yellow-200',
  Avanzado: 'bg-red-100 border-red-200',
};

const textoNivelStyles: Record<Participante['nivel'], string> = {
  Principiante: 'text-green-700',
  Intermedio: 'text-yellow-700',
  Avanzado: 'text-red-700',
};

export default function ParticipanteCard({ participante, onDelete }: ParticipanteCardProps) {
  return (
    <article
      className={`rounded-lg border p-4 shadow transition hover:shadow-lg ${nivelStyles[participante.nivel]}`}
    >
      <h3 className="text-lg font-bold">{participante.nombre}</h3>
      <p className="mt-1 text-sm text-slate-700">{participante.pais}</p>
      <p className="mt-2 text-sm text-slate-700">{participante.email}</p>
      <p className="mt-2 text-sm">
        <span className="font-semibold">Modalidad:</span> {participante.modalidad}
      </p>
      <p className={`mt-1 text-sm font-semibold ${textoNivelStyles[participante.nivel]}`}>
        Nivel: {participante.nivel}
      </p>
      <p className="mt-1 text-sm text-slate-700">Edad: {participante.edad}</p>
      <p className="mt-1 text-sm text-slate-700">
        <span className="font-semibold">Tecnologías:</span> {participante.tecnologias.join(' - ')}
      </p>

      <button
        type="button"
        onClick={() => onDelete(participante.id)}
        className="mt-4 rounded bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
      >
        Eliminar participante
      </button>
    </article>
  );
}
