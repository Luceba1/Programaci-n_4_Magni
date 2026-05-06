from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Participante(Base):
    __tablename__ = "participantes"

    id         = Column(Integer, primary_key=True, index=True)
    nombre     = Column(String(100))
    email      = Column(String(100))
    edad       = Column(Integer)
    pais       = Column(String(50))
    modalidad  = Column(String(50))
    tecnologias = Column(String(255))   # guardamos como "React,Node,Vue"
    nivel      = Column(String(50))
    acepta_terminos = Column(Boolean, default=True)