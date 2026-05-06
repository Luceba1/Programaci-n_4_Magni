from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Participante
from schemas import ParticipanteCreate, ParticipanteOut
from typing import List

router = APIRouter(prefix="/participantes", tags=["participantes"])

@router.get("/", response_model=List[ParticipanteOut])
def obtener_participantes(db: Session = Depends(get_db)):
    participantes = db.query(Participante).all()
    return [
        ParticipanteOut(
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
        for p in participantes
    ]

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
    return ParticipanteOut(
        id=nuevo.id,
        nombre=nuevo.nombre,
        email=nuevo.email,
        edad=nuevo.edad,
        pais=nuevo.pais,
        modalidad=nuevo.modalidad,
        tecnologias=nuevo.tecnologias.split(","),
        nivel=nuevo.nivel,
        aceptaTerminos=nuevo.acepta_terminos,
    )

@router.delete("/{id}")
def eliminar_participante(id: int, db: Session = Depends(get_db)):
    participante = db.query(Participante).filter(Participante.id == id).first()
    if not participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    db.delete(participante)
    db.commit()
    return {"mensaje": "Participante eliminado"}