package com.example.TP1.controller;

import com.example.TP1.model.Usuario;
import com.example.TP1.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tp1")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repo;

    // ─── ENDPOINT 1: LOGIN ───────────────────────────────────────
    @GetMapping("/login")
    public Map<String, String> login(@RequestParam String user,
                                     @RequestParam String pass) {
        Map<String, String> respuesta = new HashMap<>();
        try {
            Usuario u = repo.findByUsuarioAndClave(user, pass);
            if (u != null) {
                respuesta.put("respuesta", "OK");
                respuesta.put("mje", "Ingreso Valido. Usuario " + user);
            } else {
                respuesta.put("respuesta", "ERROR");
                respuesta.put("mje", "Ingreso Invalido, usuario y/o clave incorrecta");
            }
        } catch (Exception e) {
            respuesta.put("respuesta", "ERROR");
            respuesta.put("mje", e.getMessage());
        }
        return respuesta;
    }

    // ─── ENDPOINT 2: LISTAR / BUSCAR ─────────────────────────────
    @GetMapping("/lista")
    public Object lista(@RequestParam String action,
                        @RequestParam(required = false) String usuario) {
        Map<String, String> respuesta = new HashMap<>();
        try {
            if (action.equals("BUSCAR")) {
                List<Usuario> usuarios;
                if (usuario != null && !usuario.isEmpty()) {
                    usuarios = repo.buscarPorUsuario(usuario);
                } else {
                    usuarios = repo.findAll();
                }
                return usuarios;
            }
        } catch (Exception e) {
            respuesta.put("respuesta", "ERROR");
            respuesta.put("mje", e.getMessage());
        }
        return respuesta;
    }

    // ─── ENDPOINT 3: BLOQUEAR / DESBLOQUEAR ──────────────────────
    @GetMapping("/bloquear")
    public Map<String, String> bloquear(@RequestParam int idUser,
                                        @RequestParam String estado) {
        Map<String, String> respuesta = new HashMap<>();
        try {
            int filas = repo.actualizarBloqueado(idUser, estado);
            if (filas > 0) {
                respuesta.put("respuesta", "OK");
                respuesta.put("mje", "Bloqueo Exitoso");
            } else {
                respuesta.put("respuesta", "ERROR");
                respuesta.put("mje", "Usuario no encontrado");
            }
        } catch (Exception e) {
            respuesta.put("respuesta", "ERROR");
            respuesta.put("mje", e.getMessage());
        }
        return respuesta;
    }
}