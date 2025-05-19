package org.unl.music.base.controller.dao.dao_models;

import org.unl.music.base.models.Artista;

public class DaoArtista extends AdapterDao<Artista> {
    private Artista obj;

    public DaoArtista() {
        super(Artista.class);
        // TODO Auto-generated constructor stub
    }

    public Artista getObj() {
        if (obj == null)
            this.obj = new Artista();
        return this.obj;
    }

    public void setObj(Artista obj) {
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

    public static void main(String[] args) {
        DaoArtista da = new DaoArtista();
        da.getObj().setId(da.listAll().getLength() + 1);
        da.getObj().setNacionidad("Ecuatoriana");
        da.getObj().setNombres("Isauro Rivera");
        if (da.save())
            System.out.println("GUARDADO");
        else
            System.out.println("Hubo un error");
        da.setObj(null);
        da.getObj().setId(da.listAll().getLength() + 1);
        da.getObj().setNacionidad("Ecuatoriana");
        da.getObj().setNombres("Pool Ochao");
        if (da.save())
            System.out.println("GUARDADO");
        else
            System.out.println("Hubo un error");
    }

}
