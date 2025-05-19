package org.unl.music.base.models;

public class Cancion {
    private Integer id;
    private String nombre;
    private Integer id_genero;
    private Integer duracion;
    private String url;
    private TipoArchivoEnum tipo;
    private Integer id_album;

    public Integer getId_album() {
        return this.id_album;
    }

    public void setId_album(Integer id_album) {
        this.id_album = id_album;
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

    public Integer getId_genero() {
        return this.id_genero;
    }

    public void setId_genero(Integer id_genero) {
        this.id_genero = id_genero;
    }

    public Integer getDuracion() {
        return this.duracion;
    }

    public void setDuracion(Integer duracion) {
        this.duracion = duracion;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public TipoArchivoEnum getTipo() {
        return this.tipo;
    }

    public void setTipo(TipoArchivoEnum tipo) {
        this.tipo = tipo;
    }

}
