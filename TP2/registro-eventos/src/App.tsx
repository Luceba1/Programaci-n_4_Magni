import { useState, useEffect } from 'react'
import type { Participante } from './types'

function App() {

  // Lista de participantes - carga desde localStorage al iniciar
  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    const guardados = localStorage.getItem('participantes')
    return guardados ? JSON.parse(guardados) : []
  })

  // Estado del formulario
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [edad, setEdad] = useState('')
  const [pais, setPais] = useState('Argentina')
  const [modalidad, setModalidad] = useState('Presencial')
  const [tecnologias, setTecnologias] = useState<string[]>([])
  const [nivel, setNivel] = useState('Principiante')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  // Estado de los filtros
  const [busqueda, setBusqueda] = useState('')
  const [filtroModalidad, setFiltroModalidad] = useState('Todas')
  const [filtroNivel, setFiltroNivel] = useState('Todos')

  // Guarda en localStorage cada vez que cambia la lista
  useEffect(() => {
    localStorage.setItem('participantes', JSON.stringify(participantes))
  }, [participantes])

  // Maneja el check/uncheck de tecnologías
  const handleTecnologia = (tec: string) => {
    if (tecnologias.includes(tec)) {
      setTecnologias(tecnologias.filter(t => t !== tec))
    } else {
      setTecnologias([...tecnologias, tec])
    }
  }

  // Maneja el envío del formulario
  const handleSubmit = () => {
    if (!nombre || !email || !edad || !aceptaTerminos) {
      alert('Por favor completá todos los campos obligatorios y aceptá los términos.')
      return
    }

    const nuevo: Participante = {
      id: Date.now(),
      nombre,
      email,
      edad: Number(edad),
      pais,
      modalidad,
      tecnologias,
      nivel,
      aceptaTerminos
    }

    setParticipantes([...participantes, nuevo])

    // Limpiar el formulario
    setNombre('')
    setEmail('')
    setEdad('')
    setPais('Argentina')
    setModalidad('Presencial')
    setTecnologias([])
    setNivel('Principiante')
    setAceptaTerminos(false)
  }

  // Eliminar participante
  const handleEliminar = (id: number) => {
    setParticipantes(participantes.filter(p => p.id !== id))
  }

  // Color de fondo de la tarjeta según nivel
  const colorNivel = (nivel: string) => {
    if (nivel === 'Principiante') return 'bg-green-100'
    if (nivel === 'Intermedio') return 'bg-yellow-100'
    return 'bg-red-100'
  }

  // Color del texto del nivel
  const colorTextoNivel = (nivel: string) => {
    if (nivel === 'Principiante') return 'text-green-700'
    if (nivel === 'Intermedio') return 'text-yellow-700'
    return 'text-red-700'
  }

  // Aplicar filtros a la lista
  const participantesFiltrados = participantes.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideModalidad = filtroModalidad === 'Todas' || p.modalidad === filtroModalidad
    const coincideNivel = filtroNivel === 'Todos' || p.nivel === filtroNivel
    return coincideNombre && coincideModalidad && coincideNivel
  })

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">

        {/* TÍTULO */}
        <h1 className="text-3xl font-bold text-center mb-2 text-white bg-green-500 py-3 rounded">
          Registro de Participantes
        </h1>

        {/* CONTADOR */}
        <p className="mb-4 text-gray-600">
          Participantes registrados: <strong>{participantes.length}</strong>
        </p>

        {/* FORMULARIO */}
        <div className="bg-white shadow rounded p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Nombre */}
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />

            {/* Edad */}
            <input
              type="number"
              placeholder="Edad"
              value={edad}
              onChange={e => setEdad(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />

            {/* País */}
            <select
              value={pais}
              onChange={e => setPais(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option>Argentina</option>
              <option>Chile</option>
              <option>Uruguay</option>
              <option>México</option>
              <option>España</option>
            </select>

            {/* Modalidad */}
            <div className="md:col-span-2">
              <p className="font-semibold mb-1">Modalidad</p>
              <div className="flex gap-4">
                {['Presencial', 'Virtual', 'Híbrido'].map(op => (
                  <label key={op} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="modalidad"
                      value={op}
                      checked={modalidad === op}
                      onChange={e => setModalidad(e.target.value)}
                    />
                    {op}
                  </label>
                ))}
              </div>
            </div>

            {/* Tecnologías */}
            <div className="md:col-span-2">
              <p className="font-semibold mb-1">Tecnologías</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['React', 'Angular', 'Vue', 'Node', 'Python', 'Java'].map(tec => (
                  <label key={tec} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={tecnologias.includes(tec)}
                      onChange={() => handleTecnologia(tec)}
                    />
                    {tec}
                  </label>
                ))}
              </div>
            </div>

            {/* Nivel */}
            <select
              value={nivel}
              onChange={e => setNivel(e.target.value)}
              className="border rounded px-3 py-2 w-full md:col-span-2"
            >
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>

            {/* Acepta términos */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={e => setAceptaTerminos(e.target.checked)}
                />
                Acepto los términos y condiciones del evento
              </label>
            </div>

            {/* Botón enviar */}
            <div className="md:col-span-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Registrar
              </button>
            </div>

          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-white shadow rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <select
            value={filtroModalidad}
            onChange={e => setFiltroModalidad(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option>Todas</option>
            <option>Presencial</option>
            <option>Virtual</option>
            <option>Híbrido</option>
          </select>
          <select
            value={filtroNivel}
            onChange={e => setFiltroNivel(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option>Todos</option>
            <option>Principiante</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>

        {/* LISTA DE PARTICIPANTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participantesFiltrados.map(p => (
            <div
              key={p.id}
              className={`${colorNivel(p.nivel)} shadow rounded p-4 hover:shadow-lg transition`}
            >
              <p className="font-bold text-lg">{p.nombre}</p>
              <p className="text-gray-500">{p.pais}</p>
              <p>Modalidad: {p.modalidad}</p>
              <p className={`font-semibold ${colorTextoNivel(p.nivel)}`}>
                Nivel: {p.nivel}
              </p>
              <p>{p.tecnologias.join(', ')}</p>
              <button
                onClick={() => handleEliminar(p.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default App