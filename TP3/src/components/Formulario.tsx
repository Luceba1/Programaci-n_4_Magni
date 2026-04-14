import type { ChangeEvent, FormEvent } from 'react';
import type { FormularioParticipanteData, Modalidad, Nivel } from '../types';

interface FormularioProps {
  datos: FormularioParticipanteData;
  error: string;
  onChange: (campo: keyof FormularioParticipanteData, valor: string | boolean | string[]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const paises = ['Argentina', 'Chile', 'Uruguay', 'México', 'España'];
const modalidades: Modalidad[] = ['Presencial', 'Virtual', 'Híbrido'];
const tecnologiasDisponibles = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java'];
const niveles: Nivel[] = ['Principiante', 'Intermedio', 'Avanzado'];

export default function Formulario({ datos, error, onChange, onSubmit }: FormularioProps) {
  const manejarTecnologias = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    const nuevasTecnologias = checked
      ? [...datos.tecnologias, value]
      : datos.tecnologias.filter((tecnologia) => tecnologia !== value);

    onChange('tecnologias', nuevasTecnologias);
  };

  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">Formulario de inscripción</h2>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
            placeholder="Nombre"
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={datos.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="Email"
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Edad</label>
          <input
            type="number"
            min="1"
            value={datos.edad}
            onChange={(e) => onChange('edad', e.target.value)}
            placeholder="Edad"
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">País</label>
          <select
            value={datos.pais}
            onChange={(e) => onChange('pais', e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          >
            {paises.map((pais) => (
              <option key={pais} value={pais}>
                {pais}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium">Modalidad</span>
          <div className="flex flex-wrap gap-4">
            {modalidades.map((modalidad) => (
              <label key={modalidad} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="modalidad"
                  value={modalidad}
                  checked={datos.modalidad === modalidad}
                  onChange={(e) => onChange('modalidad', e.target.value)}
                />
                {modalidad}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium">Tecnologías conocidas</span>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {tecnologiasDisponibles.map((tecnologia) => (
              <label key={tecnologia} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={tecnologia}
                  checked={datos.tecnologias.includes(tecnologia)}
                  onChange={manejarTecnologias}
                />
                {tecnologia}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Nivel de experiencia</label>
          <select
            value={datos.nivel}
            onChange={(e) => onChange('nivel', e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          >
            {niveles.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={datos.aceptaTerminos}
              onChange={(e) => onChange('aceptaTerminos', e.target.checked)}
            />
            Acepto los términos y condiciones del evento
          </label>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Registrar participante
          </button>
        </div>
      </form>
    </section>
  );
}
