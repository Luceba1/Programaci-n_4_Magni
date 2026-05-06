from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Participante
from schemas import ParticipanteCreate, ParticipanteOut
from typing import List

router = APIRouter(prefix="/participantes", tags=["participantes"])

def serializar(p: Participante) -> ParticipanteOut:
    return ParticipanteOut(
        id=p.id,
        nombre=p.nombre,
        email=p.email,
        edad=p.edad,
        pais=p.pais,
        modalidad=p.modalidad,
        tecnologias=p.tecnologias.split(",") if p.tecnologias else [],
        nivel=p.nivel,
        aceptaTerminos=p.acepta_terminos,
    )

@router.get("/", response_model=List[ParticipanteOut])
def obtener_participantes(db: Session = Depends(get_db)):
    return [serializar(p) for p in db.query(Participante).all()]

@router.post("/", response_model=ParticipanteOut)
def crear_participante(datos: ParticipanteCreate, db: Session = Depends(get_db)):
    nuevo = Participante(
        nombre=datos.nombre,
        email=datos.email,
        edad=datos.edad,
        pais=datos.pais,
        modalidad=datos.modalidad,
        tecnologias=",".join(datos.tecnologias),
        nivel=datos.nivel,
        acepta_terminos=datos.aceptaTerminos,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return serializar(nuevo)

@router.put("/{id}", response_model=ParticipanteOut)
def editar_participante(id: int, datos: ParticipanteCreate, db: Session = Depends(get_db)):
    participante = db.query(Participante).filter(Participante.id == id).first()
    if not participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    participante.nombre = datos.nombre
    participante.email = datos.email
    participante.edad = datos.edad
    participante.pais = datos.pais
    participante.modalidad = datos.modalidad
    participante.tecnologias = ",".join(datos.tecnologias)
    participante.nivel = datos.nivel
    participante.acepta_terminos = datos.aceptaTerminos
    db.commit()
    db.refresh(participante)
    return serializar(participante)

@router.delete("/{id}")
def eliminar_participante(id: int, db: Session = Depends(get_db)):
    participante = db.query(Participante).filter(Participante.id == id).first()
    if not participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    db.delete(participante)
    db.commit()
    return {"mensaje": "Participante eliminado"}