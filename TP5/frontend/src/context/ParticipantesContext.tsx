import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { Participante } from '../models/Participante';
import { participantesReducer } from '../reducers/participantesReducer';

const API = 'http://localhost:8000/participantes';

interface ContextType {
  participantes: Participante[];
  agregar: (p: Participante) => Promise<void>;
  editar: (p: Participante) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  resetear: () => void;
}

const ParticipantesContext = createContext<ContextType | null>(null);

function mapear(p: Participante): Participante {
  return new Participante(p.id, p.nombre, p.email, p.edad, p.pais, p.modalidad, p.tecnologias, p.nivel, p.aceptaTerminos);
}

export function ParticipantesProvider({ children }: { children: ReactNode }) {
  const [participantes, dispatch] = useReducer(participantesReducer, []);

  useEffect(() => {
    fetch(`${API}/`)
      .then((r) => r.json())
      .then((data) => dispatch({ type: 'GET_PARTICIPANTES', payload: data.map(mapear) }));
  }, []);

  const agregar = async (p: Participante) => {
    const res = await fetch(`${API}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });
    const nuevo = await res.json();
    dispatch({ type: 'AGREGAR', payload: mapear(nuevo) });
  };

  const editar = async (p: Participante) => {
    const res = await fetch(`${API}/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });
    const actualizado = await res.json();
    dispatch({ type: 'EDITAR', payload: mapear(actualizado) });
  };

  const eliminar = async (id: number) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    dispatch({ type: 'ELIMINAR', payload: id });
  };

  const resetear = () => {
    dispatch({ type: 'RESET', payload: [] });
  };

  return (
    <ParticipantesContext.Provider value={{ participantes, agregar, editar, eliminar, resetear }}>
      {children}
    </ParticipantesContext.Provider>
  );
}

export function useParticipantes() {
  const ctx = useContext(ParticipantesContext);
  if (!ctx) throw new Error('useParticipantes debe usarse dentro de ParticipantesProvider');
  return ctx;
}