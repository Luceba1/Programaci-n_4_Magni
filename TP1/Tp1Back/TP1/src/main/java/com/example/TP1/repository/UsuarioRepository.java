package com.example.TP1.repository;

import com.example.TP1.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Busca un usuario por nombre de usuario Y clave (para el login)
    @Query("SELECT u FROM Usuario u WHERE u.usuario = :usuario AND u.clave = :clave")
    Usuario findByUsuarioAndClave(@Param("usuario") String usuario,
                                  @Param("clave") String clave);

    // Busca usuarios cuyo nombre contenga el texto (para el buscador con LIKE)
    @Query("SELECT u FROM Usuario u WHERE u.usuario LIKE %:texto%")
    List<Usuario> buscarPorUsuario(@Param("texto") String texto);

    // Actualiza el campo bloqueado de un usuario por su id
    @Modifying
    @Transactional
    @Query("UPDATE Usuario u SET u.bloqueado = :estado WHERE u.id = :id")
    int actualizarBloqueado(@Param("id") int id, @Param("estado") String estado);
}