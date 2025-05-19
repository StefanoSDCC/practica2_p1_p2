package org.unl.music.base.models;

import java.util.Date;

public class Album {
    private Integer id;
    private String nombre;
    private Date fecha;
    private Integer id_banda;
    private Banda banda; // Add this field if not present

public void setBanda(Banda banda) {
    this.banda = banda;
}

public Banda getBanda() {
    return this.banda;
}


    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Date getFecha() {
        return this.fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Integer getId_banda() {
        return this.id_banda;
    }

    public void setId_banda(Integer id_banda) {
        this.id_banda = id_banda;
    }

}
