package org.unl.music.base.controller.dao.dao_models;

import org.unl.music.base.models.Artista_Banda;


public class DaoArtistaBanda extends AdapterDao<Artista_Banda> {
    private Artista_Banda obj;

    public DaoArtistaBanda() {
        super(Artista_Banda.class);
        // TODO Auto-generated constructor stub
    }

    public Artista_Banda getObj() {
        if (obj == null)
            this.obj = new Artista_Banda();
        return this.obj;
    }

    public void setObj(Artista_Banda obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            obj.setId(listAll().getLength()+1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            //TODO
            return false;
            // TODO: handle exception
        }
    }

    public Boolean update(Integer pos) {
        try {
            this.update(obj, pos);
            return true;
        } catch (Exception e) {
            //TODO
            return false;
            // TODO: handle exception
        }
    }


}
