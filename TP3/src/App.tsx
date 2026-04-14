import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Participante } from './classes/Participante';
import Filtros from './components/Filtros';
import Formulario from './components/Formulario';
import ParticipanteCard from './components/ParticipanteCard';
import type { Filtros as FiltrosType, FormularioParticipanteData } from './types';

const STORAGE_KEY = 'participantes';

const datosInicialesFormulario: FormularioParticipanteData = {
  nombre: '',
  email: '',
  edad: '',
  pais: 'Argentina',
  modalidad: 'Presencial',
  tecnologias: [],
  nivel: 'Principiante',
  aceptaTerminos: false,
};

const filtrosIniciales: FiltrosType = {
  nombre: '',
  modalidad: 'Todas',
  nivel: 'Todos',
};

const participantesBase = [
  new Participante(1, 'Juan Pérez', 'juan@mail.com', 25, 'Argentina', 'Presencial', ['React', 'Node'], 'Intermedio', true),
  new Participante(2, 'Sofía Gómez', 'sofia@mail.com', 29, 'Chile', 'Virtual', ['Python', 'Vue'], 'Avanzado', true),
  new Participante(3, 'Lucas Fernández', 'lucas@mail.com', 22, 'Uruguay', 'Híbrido', ['Java', 'React'], 'Principiante', true),
];

function hidratarParticipantes(data: unknown): Participante[] {
  if (!Array.isArray(data)) return participantesBase;

  return data.map((item) => {
    const participante = item as Participante;

    return new Participante(
      Number(participante.id),
      participante.nombre,
      participante.email,
      Number(participante.edad),
      participante.pais,
      participante.modalidad,
      Array.isArray(participante.tecnologias) ? participante.tecnologias : [],
      participante.nivel,
      Boolean(participante.aceptaTerminos),
    );
  });
}

function obtenerParticipantesIniciales(): Participante[] {
  try {
    const guardados = localStorage.getItem(STORAGE_KEY);

    if (!guardados) {
      return participantesBase;
    }

    return hidratarParticipantes(JSON.parse(guardados));
  } catch {
    return participantesBase;
  }
}

export default function App() {
  const [participantes, setParticipantes] = useState<Participante[]>(obtenerParticipantesIniciales);
  const [formulario, setFormulario] = useState<FormularioParticipanteData>(datosInicialesFormulario);
  const [filtros, setFiltros] = useState<FiltrosType>(filtrosIniciales);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participantes));
  }, [participantes]);

  const participantesFiltrados = useMemo(() => {
    return participantes.filter((participante) => {
      const coincideNombre = participante.nombre
        .toLowerCase()
        .includes(filtros.nombre.toLowerCase().trim());

      const coincideNivel = filtros.nivel === 'Todos' || participante.nivel === filtros.nivel;
      const coincideModalidad =
        filtros.modalidad === 'Todas' || participante.modalidad === filtros.modalidad;

      return coincideNombre && coincideNivel && coincideModalidad;
    });
  }, [participantes, filtros]);

  const actualizarFormulario = (
    campo: keyof FormularioParticipanteData,
    valor: string | boolean | string[],
  ) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const actualizarFiltros = (campo: keyof FiltrosType, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor as FiltrosType[typeof campo] }));
  };

  const validarFormulario = () => {
    if (!formulario.nombre.trim()) return 'Debe ingresar el nombre.';
    if (!formulario.email.trim()) return 'Debe ingresar el email.';
    if (!formulario.edad || Number(formulario.edad) <= 0) return 'Debe ingresar una edad válida.';
    if (formulario.tecnologias.length === 0) return 'Debe seleccionar al menos una tecnología.';
    if (!formulario.aceptaTerminos) return 'Debe aceptar los términos y condiciones.';
    return '';
  };

  const agregarParticipante = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const mensajeError = validarFormulario();
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    const nuevoParticipante = new Participante(
      Date.now(),
      formulario.nombre.trim(),
      formulario.email.trim(),
      Number(formulario.edad),
      formulario.pais,
      formulario.modalidad,
      formulario.tecnologias,
      formulario.nivel,
      formulario.aceptaTerminos,
    );

    setParticipantes((prev) => [nuevoParticipante, ...prev]);
    setFormulario(datosInicialesFormulario);
    setError('');
  };

  const eliminarParticipante = (id: number) => {
    setParticipantes((prev) => prev.filter((participante) => participante.id !== id));
  };

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
  };

  const resetearDatos = () => {
    localStorage.removeItem(STORAGE_KEY);
    setParticipantes([]);
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6">
        <header className="rounded-lg bg-green-500 px-6 py-5 text-white shadow">
          <h1 className="text-center text-3xl font-bold">Registro de Participantes</h1>
          <p className="mt-2 text-center text-sm sm:text-base">
            TP 3 · useEffect + persistencia + componentización
          </p>
        </header>

        <Formulario
          datos={formulario}
          error={error}
          onChange={actualizarFormulario}
          onSubmit={agregarParticipante}
        />

        <Filtros
          filtros={filtros}
          onChange={actualizarFiltros}
          onClear={limpiarFiltros}
          onReset={resetearDatos}
          totalFiltrados={participantesFiltrados.length}
          totalGeneral={participantes.length}
        />

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Lista de participantes</h2>

          {participantesFiltrados.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center text-slate-500 shadow">
              No hay participantes
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {participantesFiltrados.map((participante) => (
                <ParticipanteCard
                  key={participante.id}
                  participante={participante}
                  onDelete={eliminarParticipante}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
