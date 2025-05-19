package org.unl.music.base.controller.dao.dao_models;


import org.unl.music.base.models.Album;


public class DaoAlbum extends AdapterDao<Album> {
    private Album obj;

    public DaoAlbum() {
        super(Album.class);

    }

    public Album getObj() {
        if (obj == null)
            this.obj = new Album();
        return this.obj;
    }

    public void setObj(Album obj) {
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
