import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { Participante } from './models/Participante';
import Filtros from './components/Filtros';
import Formulario from './components/Formulario';
import ParticipanteCard from './components/ParticipanteCard';
import { useParticipantes } from './context/ParticipantesContext';
import type { Filtros as FiltrosType, FormularioParticipanteData } from './types';

const datosIniciales: FormularioParticipanteData = {
  nombre: '', email: '', edad: '', pais: 'Argentina',
  modalidad: 'Presencial', tecnologias: [], nivel: 'Principiante', aceptaTerminos: false,
};

const filtrosIniciales: FiltrosType = { nombre: '', modalidad: 'Todas', nivel: 'Todos' };

export default function Home() {
  const { participantes, agregar, eliminar, resetear } = useParticipantes();
  const [formulario, setFormulario] = useState<FormularioParticipanteData>(datosIniciales);
  const [filtros, setFiltros] = useState<FiltrosType>(filtrosIniciales);
  const [error, setError] = useState('');

  const participantesFiltrados = useMemo(() => {
    return participantes.filter((p) => {
      const coincideNombre = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase().trim());
      const coincideNivel = filtros.nivel === 'Todos' || p.nivel === filtros.nivel;
      const coincideModalidad = filtros.modalidad === 'Todas' || p.modalidad === filtros.modalidad;
      return coincideNombre && coincideNivel && coincideModalidad;
    });
  }, [participantes, filtros]);

  const actualizarFormulario = (campo: keyof FormularioParticipanteData, valor: string | boolean | string[]) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const actualizarFiltros = (campo: keyof FiltrosType, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor as FiltrosType[typeof campo] }));
  };

  const validar = () => {
    if (!formulario.nombre.trim()) return 'Debe ingresar el nombre.';
    if (!formulario.email.trim()) return 'Debe ingresar el email.';
    if (!formulario.edad || Number(formulario.edad) <= 0) return 'Debe ingresar una edad válida.';
    if (formulario.tecnologias.length === 0) return 'Debe seleccionar al menos una tecnología.';
    if (!formulario.aceptaTerminos) return 'Debe aceptar los términos y condiciones.';
    return '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mensajeError = validar();
    if (mensajeError) { setError(mensajeError); return; }

    const nuevo = new Participante(
      0, // el id lo asigna la BD
      formulario.nombre.trim(), formulario.email.trim(),
      Number(formulario.edad), formulario.pais, formulario.modalidad,
      formulario.tecnologias, formulario.nivel, formulario.aceptaTerminos,
    );

    await agregar(nuevo);
    setFormulario(datosIniciales);
    setError('');
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6">
        <header className="rounded-lg bg-green-500 px-6 py-5 text-white shadow">
          <h1 className="text-center text-3xl font-bold">Registro de Participantes</h1>
          <p className="mt-2 text-center text-sm sm:text-base">
            TP 4 · FastAPI + MySQL + Context API
          </p>
        </header>

        <Formulario datos={formulario} error={error} onChange={actualizarFormulario} onSubmit={handleSubmit} />

        <Filtros
          filtros={filtros} onChange={actualizarFiltros}
          onClear={() => setFiltros(filtrosIniciales)} onReset={resetear}
          totalFiltrados={participantesFiltrados.length} totalGeneral={participantes.length}
        />

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Lista de participantes</h2>
          {participantesFiltrados.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center text-slate-500 shadow">No hay participantes</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {participantesFiltrados.map((p) => (
                <ParticipanteCard key={p.id} participante={p} onDelete={eliminar} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}