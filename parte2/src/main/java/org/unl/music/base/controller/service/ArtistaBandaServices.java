package org.unl.music.base.controller.service;

import java.util.ArrayList;

import java.util.HashMap;
import java.util.List;

import org.unl.music.base.controller.dao.dao_models.DaoArtista;
import org.unl.music.base.controller.dao.dao_models.DaoArtistaBanda;
import org.unl.music.base.controller.dao.dao_models.DaoBanda;
import org.unl.music.base.models.Artista_Banda;


import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class ArtistaBandaServices {
    private DaoArtistaBanda db;
    public ArtistaBandaServices(){
        db = new DaoArtistaBanda();
    }
    public List<HashMap<String, String>> listAll(){
        List<HashMap<String, String>> lista = new ArrayList<>();
        if(!db.listAll().isEmpty()) {
            Artista_Banda [] arreglo = db.listAll().toArray();
            DaoArtista da = new DaoArtista();
            DaoBanda db = new DaoBanda();
            for(int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString());
                aux.put("rol", arreglo[i].getRol().toString());
                aux.put("artista", da.listAll().get(arreglo[i].getId_artista() -1).getNombres());
                aux.put("banda", db.listAll().get(arreglo[i].getId_banda() -1).getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }
    
}
