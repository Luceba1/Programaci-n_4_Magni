package com.example.TP1.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios_utn")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String usuario;
    private String clave;
    private String apellido;
    private String nombre;
    private String bloqueado;

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getBloqueado() { return bloqueado; }
    public void setBloqueado(String bloqueado) { this.bloqueado = bloqueado; }
}