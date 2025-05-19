package org.unl.music.base.controller.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.unl.music.base.controller.dao.dao_models.DaoAlbum;
import org.unl.music.base.controller.dao.dao_models.DaoCancion;
import org.unl.music.base.controller.dao.dao_models.DaoGenero;
import org.unl.music.base.models.Album;
import org.unl.music.base.models.Cancion;
import org.unl.music.base.models.Genero;
import org.unl.music.base.models.TipoArchivoEnum;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed
public class CancionServices {
    private DaoCancion db;
    public CancionServices(){
        db = new DaoCancion();
    }

    public void create(@NotEmpty String nombre, Integer id_genero, Integer duracion, 
    @NotEmpty String url, @NotEmpty String tipo, Integer id_albun) throws Exception {
        if(nombre.trim().length() > 0 && url.trim().length() > 0 && 
        tipo.trim().length() > 0 && duracion > 0 && id_genero > 0 && id_albun > 0) {
            db.getObj().setNombre(nombre);
            db.getObj().setDuracion(duracion);
            db.getObj().setId_album(id_albun);
            db.getObj().setId_genero(id_genero);
            db.getObj().setTipo(TipoArchivoEnum.valueOf(tipo));
            db.getObj().setUrl(url);
            if(!db.save())
                throw new  Exception("No se pudo guardar los datos de la banda");
        }
    }

    public void update(Integer id, @NotEmpty String nombre, Integer id_genero, Integer duracion, @NotEmpty String url, @NotEmpty String tipo, Integer id_albun) throws Exception {
        if(nombre.trim().length() > 0 && url.trim().length() > 0 && tipo.trim().length() > 0 && duracion > 0 && id_genero > 0 && id_albun > 0) {
            db.setObj(db.listAll().get(id - 1));
            db.getObj().setNombre(nombre);
            db.getObj().setDuracion(duracion);
            db.getObj().setId_album(id_albun);
            db.getObj().setId_genero(id_genero);
            db.getObj().setTipo(TipoArchivoEnum.valueOf(tipo));
            db.getObj().setUrl(url);
            if(!db.update(id - 1))
                throw new  Exception("No se pudo modificar los datos de la banda");
        }        
    }
    
    public List<HashMap<String, String>> listaAlbumCombo() {
        List<HashMap<String, String>> lista = new ArrayList<>();
        DaoAlbum da = new DaoAlbum();
        if(!da.listAll().isEmpty()) {
            Album [] arreglo = da.listAll().toArray();
            for(int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", Integer.toString(arreglo[i].getId())); 
                aux.put("label", arreglo[i].getNombre());   
                lista.add(aux); 
            }
        }
        return lista;
    }

    public List<HashMap<String, String>> listaAlbumGenero() {
        List<HashMap<String, String>> lista = new ArrayList<>();
        DaoGenero da = new DaoGenero();
        if(!da.listAll().isEmpty()) {
            Genero [] arreglo = da.listAll().toArray();
            for(int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", Integer.toString(arreglo[i].getId())); 
                aux.put("label", arreglo[i].getNombre()); 
                lista.add(aux);  
            }
        }
        return lista;
    }

    public List<String> listTipo() {
        List<String> lista = new ArrayList<>();
        for(TipoArchivoEnum r: TipoArchivoEnum.values()) {
            lista.add(r.toString());
        }        
        return lista;
    }

    public List<HashMap<String, String>> listCancion(){
        List<HashMap<String, String>> lista = new ArrayList<>();
        if(!db.listAll().isEmpty()) {
            Cancion [] arreglo = db.listAll().toArray();           
            for(int i = 0; i < arreglo.length; i++) {
                
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", Integer.toString(arreglo[i].getId()));                
                aux.put("nombre", arreglo[i].getNombre());
                aux.put("genero", new DaoGenero().listAll().get(arreglo[i].getId_genero() -1).getNombre());
                aux.put("id_genero", new DaoGenero().listAll().get(arreglo[i].getId_genero() -1).getId().toString());
                aux.put("album", new DaoAlbum().listAll().get(arreglo[i].getId_album() -1).getNombre());
                aux.put("id_album", new DaoAlbum().listAll().get(arreglo[i].getId_album() -1).getId().toString());
                aux.put("url", arreglo[i].getUrl());
                aux.put("tipo", arreglo[i].getTipo().toString());
                lista.add(aux);
            }
        }
        System.out.println("size de lista "+lista.size());
        return lista;
    }
}