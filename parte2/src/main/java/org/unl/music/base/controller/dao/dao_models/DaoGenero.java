package org.unl.music.base.controller.dao.dao_models;


import org.unl.music.base.models.Genero;


public class DaoGenero extends AdapterDao<Genero> {
    private Genero obj;

    public DaoGenero() {
        super(Genero.class);

    }

    public Genero getObj() {
        if (obj == null)
            this.obj = new Genero();
        return this.obj;
    }

    public void setObj(Genero obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            obj.setId(listAll().getLength()+1);
            this.persist(obj);
            return true;
        } catch (Exception e) {

            return false;

        }
    }

    public Boolean update(Integer pos) {
        try {
            this.update(obj, pos);
            return true;
        } catch (Exception e) {

            return false;

        }
    }

    public Boolean updateId(Integer id) {
        try {
            this.update(obj, id);
            return true;
        } catch (Exception e) {

            return false;

        }
    }


}
