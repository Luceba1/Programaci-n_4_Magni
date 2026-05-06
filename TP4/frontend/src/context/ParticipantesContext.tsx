import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Participante } from '../models/Participante';

const API = 'http://localhost:8000/participantes';

interface ContextType {
  participantes: Participante[];
  agregar: (p: Participante) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  resetear: () => void;
}

const ParticipantesContext = createContext<ContextType | null>(null);

export function ParticipantesProvider({ children }: { children: ReactNode }) {
  const [participantes, setParticipantes] = useState<Participante[]>([]);

  // Carga inicial desde la API
  useEffect(() => {
    fetch(`${API}/`)
      .then((r) => r.json())
      .then((data) => {
        const lista = data.map(
          (p: Participante) =>
            new Participante(p.id, p.nombre, p.email, p.edad, p.pais, p.modalidad, p.tecnologias, p.nivel, p.aceptaTerminos)
        );
        setParticipantes(lista);
      });
  }, []);

  const agregar = async (p: Participante) => {
    const res = await fetch(`${API}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });
    const nuevo = await res.json();
    setParticipantes((prev) => [
      new Participante(nuevo.id, nuevo.nombre, nuevo.email, nuevo.edad, nuevo.pais, nuevo.modalidad, nuevo.tecnologias, nuevo.nivel, nuevo.aceptaTerminos),
      ...prev,
    ]);
  };

  const eliminar = async (id: number) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setParticipantes((prev) => prev.filter((p) => p.id !== id));
  };

  const resetear = () => setParticipantes([]);

  return (
    <ParticipantesContext.Provider value={{ participantes, agregar, eliminar, resetear }}>
      {children}
    </ParticipantesContext.Provider>
  );
}

export function useParticipantes() {
  const ctx = useContext(ParticipantesContext);
  if (!ctx) throw new Error('useParticipantes debe usarse dentro de ParticipantesProvider');
  return ctx;
}