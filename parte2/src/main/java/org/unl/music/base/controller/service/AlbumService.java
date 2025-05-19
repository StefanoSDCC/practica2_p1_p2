package org.unl.music.base.controller.service;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.unl.music.base.controller.dao.dao_models.DaoAlbum;

import org.unl.music.base.controller.dao.dao_models.DaoBanda;
import org.unl.music.base.models.Album;
import org.unl.music.base.models.Banda;


import java.util.*;



@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed

public class AlbumService {
    private static final Logger log = LogManager.getLogger(AlbumService.class);
    private DaoAlbum da;

    //private DaoBanda db;
    public AlbumService() {
        da = new DaoAlbum();
        //db = new DaoBanda();
    }

    public void createAlbum(@NotEmpty String nombre, @NotNull Date fecha, @NotNull Integer id_banda) throws Exception {
        da.getObj().setNombre(nombre);
        da.getObj().setFecha(fecha);
        da.getObj().setId_banda(id_banda);
        log.info("esta es la:{}", fecha);

        if (!da.save())
            throw new Exception("No se pudo guardar los datos del genero");
    }

    public List<Album> list(Pageable pageable) {
        return Arrays.asList(da.listAll().toArray());
    }

    public List<Album> listAll() {
        List<Album> albums = Arrays.asList(da.listAll().toArray());
        Banda[] bandas = new DaoBanda().listAll().toArray();

        for (Album album : albums) {
            Integer bandaId = album.getId_banda();
            for (Banda b : bandas) {
                if (b.getId().equals(bandaId)) {
                    album.setBanda(b);  // <-- Aquí asignas el objeto Banda
                    break;
                }
            }
        }

        return albums;
    }

    public List<HashMap<String, String>> listAllMap(){
        Album[] al = new DaoAlbum().listAll().toArray();
        Banda[] bn = new DaoBanda().listAll().toArray();
        List<HashMap<String, String>> all = new ArrayList<>();
        if (al != null){
            for (Album alb : al){
                Map<String, String> mp = new HashMap<>();
                mp.put("album", alb.getNombre());
                mp.put("albuId", alb.getId().toString());
                //mp.put("albuDate", alb.getFecha().toString());
                Integer ko = alb.getId_banda();
                mp.put("Banda", getNombreBanda(ko, bn));
                all.add((HashMap<String, String>) mp);
            }
        }
        else {
            System.out.println("Album esta vacio");
        }

        return all;
    }

    private String getNombreBanda(Integer ko, Banda [] bn){
        for (Banda bnb : bn){
            if (ko != null && ko == bnb.getId()){
                return bnb.getNombre();
            }
        }
    return null;
}

    public void updateAlbum(@NotNull Integer id, @NotEmpty String nombre, @NotNull Date fecha, @NotNull Integer id_banda) throws Exception {
        log.info("DAtos recibidos{} ", id);
        int pos = id - 1;
        Album de = new Album();
        de = da.get(pos);
        de.setNombre(nombre);
        de.setFecha(fecha);
        de.setId_banda(id_banda);
        da.update(de, pos);
    }

public static void main(String[] args) {
        AlbumService albumService = new AlbumService();

        for (HashMap<String, String> asss : albumService.listAllMap()) {
            System.out.println(asss.get("album"));
        }
        //AlbumService.listAll();
    }
}




